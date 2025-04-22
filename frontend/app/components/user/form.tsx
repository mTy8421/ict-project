
import axios from "axios"
import { useForm, type SubmitHandler } from "react-hook-form"

type Props = {}

type Input = {
  name: string
  lastname: string
}

export default function Form({ }: Props) {
  const { register, handleSubmit } = useForm<Input>()

  const dataSubmit: SubmitHandler<Input> = (data) => {
    const formData = new FormData()
    const name = formData.append('name', data.name)
    const lastname = formData.append('lastname', data.lastname)
    const result = axios.post('/api', { name, lastname })
    console.log(result)
  }

  return (
    <>
      <form onSubmit={handleSubmit(dataSubmit)}>
        <input type="text" {...register("name")} placeholder="name" />
        <input type="text" {...register("lastname")} placeholder="lastname" />
        <input type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" name="submit" />
      </form>
    </>
  )
}
