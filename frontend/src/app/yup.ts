import * as Yup from 'yup'

const jp = {
  mixed: {
    required: '入力してください',
    notType: ({ type }) => {
      let translateType = type
      if (type === 'number') {
        translateType = '数字'
      }
      return `${translateType}で入力してください`
    },
  },
  string: {
    email: 'フォーマットが不適切です',
    url: '無効なURLです',
    min: '${min}文字以上で入力してください',
    max: '${max}文字以下で入力してください',
  },
  number: {
    min: '${min}より大きな数で入力してください',
    max: '${max}より小さな数で入力してください',
  },
}

Yup.setLocale(jp)

export default Yup
