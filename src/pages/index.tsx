// import MainLayout from '@/components/layouts/MainLayout'
// import RootLayout from '@/components/layouts/RootLayout'
import { Fragment, ReactElement, useState } from 'react'
import { useTheme } from "next-themes";
import RootLayout from '@/components/layouts/root-layout';
import MainLayout from '@/components/layouts/main-layout';
import { Button, Calendar, DateMultiplePicker, DatePicker, DateRangePicker, Input, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { DateRange } from 'react-day-picker';
import { Icon } from '@iconify/react';
import Alert from '@/components/ui/alert';
type Props = {}

const Home = (props: Props) => {
  const { theme, setTheme } = useTheme()
  const [date, setDate] = useState<Date | undefined>()
  const [arrDate, setArrDate] = useState<Date[] | undefined>()
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>()

  const textContent = '<ul><li>มีเวลาเข้าเรียนภาคทฤษฎี ไม่น้อยกว่า 80%</li><li>ผ่านการสอบภาคทฤษฏี และปฎิบัติตามเกณฑ์</li><li>Complete Case Practice 2 Cases</li><li>Case Presentation &amp; Discussion 1 Case (Complete)</li></ul><p><strong>หมายเหตุ :</strong> ระยะเวลาการศึกษา ไม่รวมภาคปฎิบัติ ที่อาจต้องเพิ่มขึ้น สำหรับการให้การรักษาผู้ป่วยในบางราย</p>'

  return (
    <Fragment>
      <div className='flex flex-col gap-5'>
        <div dangerouslySetInnerHTML={{ __html: textContent }} className='tagContent' />
        <div className='flex flex-wrap justify-center items-center gap-5'>
          Tempalte NextJs and NextUI
        </div>
        <div className='flex flex-wrap justify-center items-center gap-5'>
          <Button color="primary" onClick={() => (
            Alert.message({
              content: "Open Message",
              noButton: true,
            })
          )}>
            Open Message
          </Button>

          <Button color="primary" onClick={() => (
            Alert.error({
              content: "Open Error",
            })
          )}>
            Open Error
          </Button>

          <Button color="primary" onClick={() => (
            Alert.warning({
              content: "Open warning",
            })
          )}>
            Open warning
          </Button>

          <Button color="primary" onClick={() => (
            Alert.success({
              content: "Open success",
            })
          )}>
            Open success
          </Button>

          <Button color="primary" onClick={() => (
            Alert.question({
              content: "Open Question",
            })
          )}>
            Open Question
          </Button>

        </div>
        <div className='flex items-center gap-2 p-5 rounded-lg border-1'>
          The current theme is: {theme}
          <Button onClick={() => setTheme('light')}>Light Mode</Button>
          <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
        </div>
        <DatePicker
          mode="single"
          label="DatePicker"
          placeholder='Picker Date'
          labelPlacement="inside"
          variant="faded"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
        <DateMultiplePicker
          mode="multiple"
          label="DateMultiplePicker"
          placeholder='DateMultiplePicker'
          labelPlacement="outside"
          variant="bordered"
          captionLayout='dropdown-buttons'
          selected={arrDate}
          onSelect={setArrDate}
          defaultMonth={arrDate ? arrDate[0] : new Date()}
        />
        <DateRangePicker
          mode="range"
          label="DateRangePicker"
          placeholder='DateMultiplePicker'
          labelPlacement="inside"
          variant="bordered"
          captionLayout='dropdown-buttons'
          selected={rangeDate}
          onSelect={setRangeDate}
          numberOfMonths={2}
          defaultMonth={rangeDate?.from}
        />
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          labelPlacement="inside"
          variant='bordered'
        />
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          labelPlacement="outside"
          variant='bordered'
        />
      </div>
    </Fragment >
  )
}
export default Home

Home.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <RootLayout>
        <MainLayout>
          {page}
        </MainLayout>
      </RootLayout>
    </Fragment>
  );
};