import Table from "./table"

type Props = {}

export function HomeUser({ }: Props) {
  return (
    <>
      <div>
        <p className="text-9xl text-center">Home Page</p>
        <Table />
      </div>
    </>
  )
}

export function WorkUser({ }: Props) {

  return (
    <>
      <div>
        <p className="text-9xl text-center">WorkUser</p>
      </div>
    </>
  )
}
