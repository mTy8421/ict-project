import axios from "axios"
import { useForm, type SubmitHandler } from "react-hook-form"

type Input = {
  name: string
  lastname: string
}

type Props = {}
export default function Form({ }: Props) {
  const { register, handleSubmit } = useForm<Input>()

  const dataSubmit: SubmitHandler<Input> = async (data) => {
    const formData = new FormData()
    const name = formData.append('name', data.name)
    const lastname = formData.append('lastname', data.lastname)

    const result: any = await axios.post('/api', { name, lastname })
    console.log(result.data)
  }

  return (
    <>
      <div className="md:col-span-1">
        <div className="rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-center">Edit Form</div>

            <form onSubmit={handleSubmit(dataSubmit)}>
              <span>ประเถทงาน</span>
              <input type="text" {...register("name")} placeholder="name" />
              <input type="text" {...register("lastname")} placeholder="lastname" />
              <button type="submit">Submit</button>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}
