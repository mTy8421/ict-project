import { useForm, type SubmitHandler } from "react-hook-form"

type Input = {
  workType: string
  workDo: string
  workValue: string
  workStatus: string
}

type Props = {}
export default function Form({ }: Props) {
  const { register, handleSubmit } = useForm<Input>()

  const dataSubmit: SubmitHandler<Input> = async (data) => {
    const formData = new FormData()
    formData.append('workType', data.workType)
    formData.append('workDo', data.workDo)
    formData.append('workValue', data.workValue)
    formData.append('workStatus', data.workStatus)
  }

  return (
    <>
      <div className="md:col-span-1">
        <div className="rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-center">Edit Form</div>

            <form onSubmit={handleSubmit(dataSubmit)} className="flex flex-col">

              <div className="mt-3 text-center">
                <span className="">ประเถทงาน: </span>
                <select {...register("workType")} className="select w-2/4">
                  <option value=""></option>
                  <option value="1">ด้านการปฏิบัติการ (ภารหน้าที่ที่ปฏิบัติเป็นประจำ)</option>
                  <option value="2">ด้านการวางแผน (การวางแผนการทำงาน หรือร่วมวางแผนของหน่วยงานเพื่อบรรลุวัตถุประสงค์)</option>
                  <option value="3">ด้านการประสานงาน (การติดต่อประสานงานร่วมกันกับหน่วยงานภายในและภายนอก รวมถึงชี้แจ้งข้อมูลให้บุคคลที่เกี่ยวข้องเข้าใจ)</option>
                  <option value="4">ด้านการบริการ (การให้คำปรึกษาแนะนำ ตอบปัญหา รวมถึงให้ข้อมูลที่เป็นประโยชน์ที่สนับสนุนต่อภารกิจหน่วยงาน)</option>
                  <option value="5">เข้าร่วมประชุมโครงการอบรบพัฒนาตนเอง</option>
                  <option value="6">งานอื่นๆ ที่ได้รับมอบหมาย</option>
                </select>
              </div>

              <div className="mt-3 text-center">
                <span className="">ระบุสิ่งที่ทำ: </span>
                <textarea className="textarea w-2/4" {...register("workDo")} placeholder=""></textarea>
              </div>

              <div className="mt-3 text-center">
                <span className="">ผลของงาน: </span>
                <input type="text" className="input w-2/4" {...register("workValue")} placeholder="lastname" />
              </div>

              <div className="mt-3 text-center">
                <span className="">ไม่สำเร็จเนื่องจาก: </span>
                <input type="text" className="input w-2/4" {...register("workStatus")} placeholder="lastname" />
              </div>

              <div className="mt-4 text-right">
                <button type="submit" className="btn btn-info text-white mx-3">Save</button>
                <button type="button" className="btn btn-error text-white">Cancel</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}
