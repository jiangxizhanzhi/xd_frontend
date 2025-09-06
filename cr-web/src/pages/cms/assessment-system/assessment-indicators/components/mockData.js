export const mockData = {
  message: null,
  code: 2,
  data: {
    third_indexes: [
      {
        index_id: '15e926cc-869a-45e9-b3af-44fc10009a7b',
        name: '01',
        children_ids: [], //这个参数毫无意义
        format_algorithm_id: 'f3d63efc-636e-435d-97b7-ea0c8a849c56',
        detection_algorithm_id: '9cbf955c-94c3-4baa-8355-2cb077508767',
        score_algorithm_id: 'a5600b90-37ef-4bfc-bed8-dd150aeb4e13', //
        eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        detection_algorithm_params: '70',
        score_algorithm_params: '',
        format_algorithm_params: '',
      },
      {
        index_id: '1807913f-36f3-4298-bdd9-91fa735ab831',
        name: '02',
        children_ids: [], //这个参数毫无意义
        format_algorithm_id: '0624571b-d3c7-43fe-9f34-4059bf4db39f',
        detection_algorithm_id: '9cbf955c-94c3-4baa-8355-2cb077508767',
        score_algorithm_id: 'bb7ce035-db4c-4f37-ae26-85aea72f40a6',
        eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        detection_algorithm_params: '70',
        score_algorithm_params: '',
        format_algorithm_params: '',
      },
      {
        index_id: '0bd029ed-c093-4f4c-b829-fd5c842a8618',
        name: '222',
        children_ids: [], //这个参数毫无意义
        format_algorithm_id: '0624571b-d3c7-43fe-9f34-4059bf4db39f',
        detection_algorithm_id: '9cbf955c-94c3-4baa-8355-2cb077508767',
        score_algorithm_id: 'a5600b90-37ef-4bfc-bed8-dd150aeb4e13',
        eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        detection_algorithm_params: '70',
        score_algorithm_params: '',
        format_algorithm_params: '',
      },
    ],
    second_indexes: [
      {
        index_id: 'fac132f7-0041-4833-8580-77d2cffb3913',
        name: '555',
        algorithm_id: '115d1d5f-bf22-42f6-8773-7509386c2f9b',
        eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        params: '',
        children_ids: [
          '15e926cc-869a-45e9-b3af-44fc10009a7b',
          '1807913f-36f3-4298-bdd9-91fa735ab831',
          '0bd029ed-c093-4f4c-b829-fd5c842a8618',
        ],
      },
      {
        index_id: 'cd072b12-839f-458a-bd58-4457f6433f80',
        name: '444',
        algorithm_id: '7abe0170-4a60-4395-9296-57ca1075b65b',
        eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        params: '',
        children_ids: ['1807913f-36f3-4298-bdd9-91fa735ab831'],
      },
    ],
    first_indexes: [
      {
        index_id: '458f69fd-53fd-419d-90b7-9143cf31ba71',
        name: '888',
        algorithm_id: 'bf06ec34-e14b-44e9-9762-38467df4f0ad',
        // eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
        params: '',
        children_ids: [
          'fac132f7-0041-4833-8580-77d2cffb3913',
          'cd072b12-839f-458a-bd58-4457f6433f80',
        ],
      },
    ],
    connlist:
      '[{"sourceNodeId":"1807913f-36f3-4298-bdd9-91fa735ab831","targetNodeId":"cd072b12-839f-458a-bd58-4457f6433f80","label":"计算最高分"},{"sourceNodeId":"15e926cc-869a-45e9-b3af-44fc10009a7b","targetNodeId":"fac132f7-0041-4833-8580-77d2cffb3913","label":"计算最低分"},{"sourceNodeId":"1807913f-36f3-4298-bdd9-91fa735ab831","targetNodeId":"fac132f7-0041-4833-8580-77d2cffb3913","label":"计算最低分"},{"sourceNodeId":"0bd029ed-c093-4f4c-b829-fd5c842a8618","targetNodeId":"fac132f7-0041-4833-8580-77d2cffb3913","label":"计算最低分"},{"sourceNodeId":"fac132f7-0041-4833-8580-77d2cffb3913","targetNodeId":"458f69fd-53fd-419d-90b7-9143cf31ba71","label":"均方差平均"},{"sourceNodeId":"cd072b12-839f-458a-bd58-4457f6433f80","targetNodeId":"458f69fd-53fd-419d-90b7-9143cf31ba71","label":"均方差平均"}]',
    desc: '1111',
    name: '哈哈哈哈哈',
    eval_system_id: 'b026dc58-d1c6-4863-863c-1d0da30dceba',
  },
  field: null,
};
export const mockAlgorithmIdArr = [
  {
    algorithm_id: '115d1d5f-bf22-42f6-8773-7509386c2f9b',
    name: 'aaaa',
  },
  {
    algorithm_id: '7abe0170-4a60-4395-9296-57ca1075b65b',
    name: 'aaaa',
  },
  {
    algorithm_id: 'bf06ec34-e14b-44e9-9762-38467df4f0ad',
    name: 'aaaa',
  },
];
