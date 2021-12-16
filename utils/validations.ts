import * as yup from 'yup'

const mintTokenFormSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required().positive().min(1, 'Price is too low'),
  fileUrl: yup.string().required('Image is required'),
})

export { mintTokenFormSchema }
// check validity
// schema
//   .isValid({
//     name: 'jimmy',
//     age: 24,
//   })
//   .then(function (valid) {
//     valid; // => true
//   });

// // you can try and type cast objects to the defined schema
// schema.cast({
//   name: 'jimmy',
//   age: '24',
//   createdOn: '2014-09-23T19:25:25Z',
// });
