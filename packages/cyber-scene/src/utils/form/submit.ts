/**
 * 校验表单
 * @param ruleForm
 * @param data
 */
export function useSubmitForm(ruleForm: any, data?: any) {
  let result = {
    status: false,
    data,
    type: 'sure',
    error: '',
  };
  ruleForm.validate((valid: any, error: any) => {
    if (valid) {
      result.status = true;
    } else {
      result.status = false;
      result.error = error;
      return false;
    }
  });
  return result;
}

/**
 * 重置表单
 * @param ruleForm
 */
export function useResetForm(ruleForm: any) {
  ruleForm.resetFields();
  return {
    status: true,
    data: {},
    type: 'cancel',
  };
}
