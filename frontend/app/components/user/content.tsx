import { BarChart } from "~/lib/user/barChart"
import Table from "./table"

type Props = {}

export function HomeUser({ }: Props) {
  return (
    <>
      <div>
        <p className="text-9xl text-center">Dashboard</p>

        <div className="grid grid-cols-2">

          <div className="col-span-1">
            <div className="rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">Test</div>
                <BarChart />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-center">Test</div>
                <BarChart />
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
