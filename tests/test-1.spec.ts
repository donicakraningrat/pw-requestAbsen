import { test, expect } from '@playwright/test';
import reader from 'xlsx';

const file = reader.readFile("./20231227043119-1988246-export_attendance.xlsx");
const data:Record<string,unknown>[] = reader.utils.sheet_to_json(file.Sheets["Export Attendance"]);


for (const record of data) {
  test(`Attendance date: ${record["Date*"]}`, async ({ page }) => {
    

    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(record["Date*"] as string);
    expect(parts).toBeTruthy();
    const dateParts = parts?.slice(1).map((p) => parseInt(p, 10)) || [];


    const date = dateParts[2];
    const month = "December";
    const year = dateParts[0];

    test.skip(record["Shift"] !== 'WFO','dayoff');
    if(record['Check In'] && record['Check Out']) test.skip(true,'sudah di isi');
    

  
    await page.goto('https://account.mekari.com/users/sign_in');
    await expect(page).toHaveTitle(/Mekari Account/);
    await page.getByLabel('Email').fill('doni.cakraningrat@prakerja.go.id');
    await page.getByLabel('Password').fill('D1k@nt0r');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    // await expect(page.getByRole('navigation')).toContainText('Doni Wicaksana Wahyu Cakraningrat');
    await page.getByRole('button', { name: 'Masuk ke Talenta' }).click();
    await page.getByRole('button', { name: 'More request' }).click();
    await page.getByRole('link', { name: 'Attendance', exact: true }).click();
    await page.waitForLoadState("load");
    await page.getByRole('link', { name: 'Request Shift / Attendance' }).click();
    await page.locator('#formSendRequest').getByText('Attendance').click();
    await page.locator('#datepicker_request').click();
    let rowCalendarDate = new RegExp(`(?:\\s|^)${date} ${month}, ${year}`);
    let calendarDate = new RegExp(`^${date} ${month}, ${year}`);
    await page.getByRole('row', { name: rowCalendarDate,  }).getByLabel(calendarDate).click();
    await page.getByRole('button', { name: 'Select' }).click();
    await page.locator('div:nth-child(4) > div > div > div:nth-child(2) > div').first().click();
  //
  // Check In
  if(!record['Check In']){
  await page.getByText("Check In").check();
  let rndInt = Math.floor(Math.random() * 40) + 1;
  rndInt = rndInt+10;
  const minutes = `${rndInt}`.padStart(2,'0')
  await page.locator('#checkInAttendance').fill(`08:${minutes}`);
} else
await page.getByText("Check In").uncheck();
  //
  // Check Out

  if(!record['Check Out']){
    await page.getByText("Check Out").check();
    let rndIntOut = Math.floor(Math.random() * 40) + 1;
    rndIntOut = rndIntOut+10;
    const minutesOut = `${rndIntOut}`.padStart(2,'0')
    await page.locator('#checkOutAttendance').fill(`18:${minutesOut}`);
  } else 
  await page.getByText("Check Out").uncheck();
    //
    await page.getByLabel('Notes').fill('lupa Checkin dan lupa check Out');
    // await page.waitForTimeout(10000);


    ////
    await page.locator('#btnSaveRequest').click();
    await expect(page.locator('#attendanceRequestHistory')).toContainText('2023-12-04');
    await expect(page.locator('#attendanceRequestHistory')).toContainText('Pending');
  });
}

function parseDate(input:string) {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  if (!parts) {
    return null;
  }
  return parts.slice(1).map((p) => parseInt(p, 10));
}