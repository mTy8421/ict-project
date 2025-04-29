import { BarChart } from "~/lib/user/barChart"
import Table from "./table"
import { Doughnuts } from "~/lib/user/doughnutChart"

type Props = {}

export function HomeUser({ }: Props) {
  return (
    <>
      <div>
        <p className="text-9xl text-center">Dashboard</p>

        <div className="md:grid md:grid-cols-2">

          <div className="md:col-span-1">
            <div className="rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">จำนวนภาระงาน</div>
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

export function WorkUser({ }: Props) {

  return (
    <>
      <div>
        <p className="text-9xl text-center">WorkUser</p>
        <Table />
      </div>
    </>
  )
}
