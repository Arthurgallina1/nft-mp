import * as yup from 'yup'

const mintTokenFormSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().positive().min(1, 'Price is too low'),
  fileUrl: yup.string().required('Image is required'),
})

export { mintTokenFormSchema }
