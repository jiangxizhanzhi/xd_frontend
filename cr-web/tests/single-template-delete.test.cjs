const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '../src/pages/cms/cr-event/event-list-train-single.vue'),
  'utf8',
);
const script = source
  .match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/^import .*;\s*$/gm, '')
  .replace('export default', 'module.exports =');
const sandbox = {
  module: { exports: {} },
  ImportFile: {},
  privateExercisesAuth: {},
  EVENT_DIFFICULT_LIST: [],
  IndexDB: {},
};
vm.runInNewContext(script, sandbox);
const deleteRow = sandbox.module.exports.methods.deleteRow;
const rows = [{ resource_id: 'template-1' }, { resource_id: 'template-2' }];
const rooms = [
  {
    room_id: 'room-1',
    template_name: 'Template One',
    user_name: 'student01',
    name: 'Student One',
  },
  {
    room_id: 'room-2',
    template_name: 'Template Two',
    user_name: '<img src=x onerror=alert(1)>',
    name: '',
  },
];

function fixture(options = {}) {
  const calls = {
    deletes: [],
    confirmations: [],
    done: [],
    reloads: 0,
    successes: 0,
  };
  const context = {
    selection: [...rows],
    $request: {
      async post(url, data) {
        assert.equal(url, '/cr/admin/single_train/template/delete_rooms');
        assert.deepEqual(Array.from(data.ids), ['template-1', 'template-2']);
        if (options.previewError) throw new Error('Preview failed');
        return { data: { code: 'OJ-000000', data: options.rooms || rooms } };
      },
      async delete(url, data, config) {
        assert.equal(config.timeout, 0);
        calls.deletes.push({ url, data: JSON.parse(JSON.stringify(data)) });
        if (options.deleteError) throw new Error('Close failed');
      },
    },
    $createElement(tag, data, children) {
      return children === undefined
        ? { tag, children: data }
        : { tag, data, children };
    },
    $t(key) {
      return key;
    },
    async $confirm(message, title, config) {
      calls.confirmations.push({ message, title, config });
      if (options.onConfirm) options.onConfirm();
      if (options.cancel) throw 'cancel';
      if (options.confirmation) await options.confirmation;
    },
    $message: {
      success() {
        calls.successes += 1;
      },
    },
    $refs: {
      eventListTableRef: {
        reload() {
          calls.reloads += 1;
        },
      },
    },
  };
  return { context, calls, done: (value) => calls.done.push(value) };
}

test('shows every affected account and submits only the confirmed room snapshot', async () => {
  const { context, calls, done } = fixture();
  await deleteRow.call(context, rows, done);
  const confirmation = calls.confirmations[0];
  const content = JSON.stringify(confirmation.message);
  assert.ok(content.includes('student01'));
  assert.ok(content.includes('Template Two'));
  assert.ok(content.includes('<img src=x onerror=alert(1)>'));
  assert.equal(confirmation.message.tag, 'div');
  assert.equal(confirmation.config.dangerouslyUseHTMLString, undefined);
  assert.equal(
    confirmation.config.confirmButtonText,
    'crEvent.closeTrainingsAndDelete',
  );
  assert.deepEqual(calls.deletes, [
    {
      url: '/cr/admin/single_train/template',
      data: {
        ids: ['template-1', 'template-2'],
        room_ids: ['room-1', 'room-2'],
      },
    },
  ]);
  assert.equal(calls.reloads, 1);
  assert.equal(calls.successes, 1);
  assert.equal(context.selection.length, 0);
});

test('does not start closing rooms while confirmation is pending', async () => {
  let confirm;
  let entered;
  const confirmation = new Promise((resolve) => {
    confirm = resolve;
  });
  const showing = new Promise((resolve) => {
    entered = resolve;
  });
  const { context, calls, done } = fixture({
    confirmation,
    onConfirm: entered,
  });
  const pending = deleteRow.call(context, rows, done);
  await showing;
  assert.equal(calls.confirmations.length, 1);
  assert.equal(calls.deletes.length, 0);
  confirm();
  await pending;
  assert.equal(calls.deletes.length, 1);
});

test('cancel leaves the templates, rooms and selection untouched', async () => {
  const { context, calls, done } = fixture({ cancel: true });
  await deleteRow.call(context, rows, done);
  assert.equal(calls.deletes.length, 0);
  assert.equal(calls.reloads, 0);
  assert.equal(calls.successes, 0);
  assert.equal(context.selection.length, 2);
  assert.deepEqual(calls.done, [false]);
});

test('preview failure never displays a delete confirmation or sends a delete', async () => {
  const { context, calls, done } = fixture({ previewError: true });
  await deleteRow.call(context, rows, done);
  assert.equal(calls.confirmations.length, 0);
  assert.equal(calls.deletes.length, 0);
  assert.deepEqual(calls.done, [false]);
});

test('close failure does not report deletion success or clear selection', async () => {
  const { context, calls, done } = fixture({ deleteError: true });
  await deleteRow.call(context, rows, done);
  assert.equal(calls.reloads, 0);
  assert.equal(calls.successes, 0);
  assert.equal(context.selection.length, 2);
  assert.deepEqual(calls.done, [false]);
});

test('unused templates still require confirmation and send no room IDs', async () => {
  const { context, calls, done } = fixture({ rooms: [] });
  await deleteRow.call(context, rows, done);
  assert.equal(
    calls.confirmations[0].message,
    'crEvent.confirmDeleteSingleTemplates',
  );
  assert.equal(
    calls.confirmations[0].config.confirmButtonText,
    'common.confirm',
  );
  assert.deepEqual(calls.deletes[0].data.room_ids, []);
});
