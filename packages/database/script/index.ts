import axios from 'axios'

axios.post('http://localhost:8080/user/create', {
    displayName: 'Tan Wei Seng',
    username: 'weiseng',
    email: 'tanweiseng18@gmail.com',
    modulesDone: ['CS1101S', 'CS2030S', 'CS1231S', 'CS2040S'],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
}).then((msg) => {
    console.log(msg)
})

axios.post('http://localhost:8080/user/create', {
    displayName: 'Nguyen Vu Khang',
    username: 'nguyenvukhang',
    email: 'brew4k@gmail.com',
    modulesDone: ['MA2001', 'MA2002', 'CS1010S', 'MA2219'],
    modulesDoing: [],
    matriculationYear: 2021,
    graduationYear: 2025,
    graduationSemester: 2,
}).then((msg) => {
    console.log(msg)
})
