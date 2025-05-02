import { BarChart } from "~/lib/user/barChart"
import Table from "./table"
import { Doughnuts } from "~/lib/user/doughnutChart"

type PropsHomeUser = {
  name: string
}

type PropsWorkUser = {}

export function HomeUser({ name }: PropsHomeUser) {
  return (
    <>
      <div>
        <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" alt="images" className="text-center mx-auto max-w-25" />
        <p className="text-center">{name}</p>

        <div className="md:grid md:grid-cols-2">

          <div className="md:col-span-1">
            <div className="rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">จำนวนภาระงานประจำเดือน</div>
                <BarChart />
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">จำนวนภาระงาน</div>
                <Doughnuts />
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export function WorkUser({ }: PropsWorkUser) {

  return (
    <>
      <div>
        <p className="text-9xl text-center">Work User</p>
        <Table />
      </div>
    </>
  )
}
