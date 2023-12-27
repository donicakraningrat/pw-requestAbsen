// Requiring the module 
import reader from 'xlsx';

function read(filePath: string) {
    // Reading our test file 
    const file = reader.readFile(filePath);
    let data: unknown[] = []
    const sheets = file.SheetNames
    for (let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res);
        })
    }
    // Printing data 
    console.log(data);
}

// function write(filePath:string){
//     const file = reader.readFile(filePath) 

// // Sample data set 
// let student_data = [{ 
//     Student:'Nikhil', 
//     Age:22, 
//     Branch:'ISE', 
//     Marks: 70 
// }, 
// { 
//     Student:'Amitha', 
//     Age:21, 
//     Branch:'EC', 
//     Marks:80 
// }] 

// const ws = reader.utils.json_to_sheet(student_data) 

// reader.utils.book_append_sheet(file,ws,"Sheet3") 

// // Writing to our file 
// reader.writeFile(file,filePath) 
// }


read("./20231227043119-1988246-export_attendance.xlsx");