import { Link } from "react-router"

import "./css/styles.css"

type Props = {
  name: string,
  role: string
}

export default function Navbar({ role, name }: Props) {

  return (
    <>

      <aside className="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
        <div className="p-6">
          <Link to={'#'} className="text-white text-3xl font-semibold uppercase hover:text-gray-300">{role}</Link>
          <button className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
            <i className="fas fa-plus mr-3"></i> {name}
          </button>
        </div>
        <nav className="text-white text-base font-semibold pt-3">
          <Link to={'#'} className="flex items-center active-nav-link text-white py-4 pl-6 nav-item">
            <i className="fas fa-tachometer-alt mr-3"></i>
            หน้าหลัก
          </Link>
          <Link to={'#'} className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
            <i className="fas fa-sticky-note mr-3"></i>
            ภาระงานที่ได้รับมอบหมาย
          </Link>
          <Link to={'#'} className="flex items-center text-white opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
            <i className="fas fa-table mr-3"></i>
            ประวัติการทำงาน
          </Link>
        </nav>
        <Link to={'#'} className="absolute w-full upgrade-btn bottom-0 active-nav-link text-white flex items-center justify-center py-4">
          <i className="fas fa-arrow-circle-up mr-3"></i>
          ออกจากระบบ
        </Link>
      </aside>
    </>
  )
}
