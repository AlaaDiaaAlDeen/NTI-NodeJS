// bank customers 
// => add name, balance, accNum
// => delete
// => withdraw
// => add balance
// => show all
// => filter


const userHeads = ['userName', 'accBalance']

const formButton = document.querySelector('#formButton')
const formSection = document.querySelector('#formSection')
const formData = document.querySelector('#formSection form')
const tableBody = document.querySelector('#customersTable')
const searchBar = document.querySelector('#searchBar')

const setUsers = function(users){
    localStorage.setItem('users', JSON.stringify(users))
}

const getUsers = function(){
    return JSON.parse(localStorage.getItem('users') || '[]')
}

const addElement = function(parent, tag, attr, classes, text){
    const element = document.createElement(tag)
    parent.appendChild(element)
    if(classes!='')element.classList = classes
    if(text!='')element.innerText = text
    keys = Object.keys(attr)
    keys.forEach(key=>element.setAttribute(key, attr[key]))
    return element
}

const getRecInd = function(rec){
    records = Object.values(document.querySelectorAll('.record'))
    index = records.findIndex(element=>element==rec)
    return index
}

const addBalance = function(users, index){
    amount = ''
    do{amount =prompt("Enter the amount")}
    while(isNaN(amount))
    users[index].accBalance = Number(users[index].accBalance) + Number(amount)
    setUsers(users)
}

const withdraw = function(users, index){
    amount = ''
    do{amount = prompt("Enter the amount")}
    while(isNaN(amount) || amount>users[index].accBalance)
    users[index].accBalance -= amount
    setUsers(users)
}

const delUser = function(users, index){
    document.querySelectorAll('.record')[index].remove()
    users.splice(index, 1)
    setUsers(users)
}

const showUsers = function(text=''){
    users = getUsers()
    tableBody.innerText=''
    if(users.length){
        document.querySelector('#noUsers').classList.add('d-none')
        users.filter(u=>u.userName.toLowerCase().includes(text))
        .forEach(user=>{
            row = addElement(tableBody, 'tr', {}, 'record', '')
            addElement(row, 'td', {}, '', user.accNum)
            addElement(row, 'td', {}, '', user.userName)
            addElement(row, 'td', {}, '', user.accBalance || '0')
            actions = addElement(row, 'td', {}, '', '')
            
            add = addElement(actions, 'button', {}, 'btn btn-success btn-sm', 'Add balance')
            add.addEventListener('click', function(){
                index = getRecInd(this.parentNode.parentNode)
                addBalance(users, index)
                showUsers()
            })

            draw = addElement(actions, 'button', {}, 'btn btn-success btn-sm ', 'Withdraw')
            draw.addEventListener('click', function(){
                index = getRecInd(this.parentNode.parentNode)
                withdraw(users, index)
                showUsers()
            })

            del = addElement(actions, 'button', {}, 'btn btn-danger btn-sm ', 'Delete')
            del.addEventListener('click', function(){
                index = getRecInd(this.parentNode.parentNode)
                delUser(users, index)
                showUsers()
            })
        })

    }else document.querySelector('#noUsers').classList.remove('d-none')

}

formButton.addEventListener('click', function(){
    this.innerText==='Show add form'? this.innerText='Hide add form':this.innerText='Show add form'
    formSection.classList.toggle('d-none')
})

formData.addEventListener('submit', function(e){
    e.preventDefault()
    
    user = {accNum: String(new Date().getTime()).substr(7,6)}
    userHeads.forEach(key=> user[key] = this.elements[key].value)

    users = getUsers()
    users.push(user)
    setUsers(users)

    formButton.innerText='Show add form'
    formSection.classList.toggle('d-none')
    this.reset()

    showUsers('')
})

searchBar.addEventListener('keyup', function(e){
    showUsers(this.value.trim().toLowerCase())
})

showUsers()
