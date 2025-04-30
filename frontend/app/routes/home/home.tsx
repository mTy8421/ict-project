import { useForm, type SubmitHandler } from "react-hook-form"

import type { Route } from "./+types/home";
import './css/style.css'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login" },
  ];
}

type Input = {
  email: string
  password: string
}

export default function Home() {

  const { register, handleSubmit } = useForm<Input>()

  const dataSubmit: SubmitHandler<Input> = async (data) => {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    const email = formData.get('email')
    const password = formData.get('password')

    if (email == "" || password == "") {
      alert("password is worng!!")
    } else {
      window.location.href = "/user"
    }

  }

  return (
    <>
      <div className="wrapper">
        <h1>Support Staff Workload System</h1>
        <p id="error-message"></p>
        <form id="form" onSubmit={handleSubmit(dataSubmit)}>
          <div>
            <label>
              <span>@</span>
            </label>
            <input
              type="text"
              {...register("email")}
              name="email"
              id="email-input"
              placeholder="Email"
            />
          </div>
          <div>
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"
                />
              </svg>
            </label>
            <input
              type="password"
              {...register("password")}
              name="password"
              id="password-input"
              placeholder="Password"
            />
          </div>
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
        <p>เข้าสู่ระบบผ่าน <a href="/api/google">google</a></p>
      </div>
    </>
  )
}

