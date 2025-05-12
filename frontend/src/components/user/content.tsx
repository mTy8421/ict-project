import { BarChart } from "../../lib/user/barChart"
import Table from "./table"
import { Doughnuts } from "../../lib/user/doughnutChart"

type PropsHomeUser = {
  name: string
}

type PropsWorkUser = {}

export function HomeUser({ name }: PropsHomeUser) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <img 
          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740" 
          alt="images" 
          className="mx-auto w-24 h-24 rounded-full object-cover" 
        />
        <p className="mt-2 text-lg font-medium">{name}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">จำนวนภาระงานประจำเดือน</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full h-full">
                <BarChart />
              </div>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">จำนวนภาระงาน</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48">
                <Doughnuts />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function WorkUser({ }: PropsWorkUser) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">ภาระงานที่ได้รับมอบหมาย</h1>
        <p className="mt-1 text-sm text-gray-500">รายการภาระงานทั้งหมดที่ได้รับมอบหมาย</p>
      </div>
      
      <div className="bg-white rounded-lg">
        <Table />
      </div>
    </div>
  )
}
