

console.log('connected')

const getAllBtn = document.querySelector('#all')
const charBtns = document.querySelectorAll('.char-btns')
const ageForm = document.querySelector('#age-form')
const ageInput = document.querySelector('#age-input')
const createForm = document.querySelector('#create-form')
const newFirstInput = document.querySelector('#first')
const newLastInput = document.querySelector('#last')
const newGenderDropDown = document.querySelector('select')
const newAgeInput = document.querySelector('#age')
const newLikesText = document.querySelector('textarea')
const charContainer = document.querySelector('section')

// const baseURL = 

function createCharacterCard(char) {
  let charCard = document.createElement('div')
  charCard.innerHTML = `<h3>${char.firstName} ${char.lastName}</h3>
  <p>gender: ${char.gender} | age: ${char.age}</p>
  <h4>Likes</h4>
  <ul>
    <li>${char.likes[0]}</li>
    <li>${char.likes[1]}</li>
    <li>${char.likes[2]}</li>
  </ul>`

  charContainer.appendChild(charCard)
}


//This function will clear all character cards displayed on the screen and we will use this to clear all characters when we grab a new list or new single character. If we Don't do this our character list will continuously grow forever when we create new characters cards. 
function clearCharacters() {
  charContainer.innerHTML = ``
}


//getAllChars will request the entire list of characters and when promise is resolved and data is returned back to us, we will take that returned data(array of character objects from server) and create new html elements and add them into the DOM using the createCharacterCard function above. 
function getAllChars() {
  axios.get('http://localhost:4000/characters')
    .then((res) => {
      clearCharacters();
      const newCharacterArr = res.data
      for (let char of newCharacterArr) {
        createCharacterCard(char)
      }
      // for(let i = 0; i < newCharacterArr.length; i++){
      //   createCharacterCard(newCharacterArr[i])
      // }
    })
    .catch(err => console.log(err))
}
//Here we add the getAllChars to the 'Get All Characters' btn
getAllBtn.addEventListener('click', getAllChars)

//==============================================================
//getSingleChar requests a single character by their name, we get the name from the id of the button element that we click on and use that name to add a param to our request which the server will use to find the single character and send us the character object back which we will use to display the single character using the createCharacterCard function above.
function getSingleChar(event) {
  const name = event.target.id
  axios.get(`http://localhost:4000/character/${name}`)
    .then(res => {
      clearCharacters();
      const newChar = res.data
      createCharacterCard(newChar)
    })
}


for (let btn of charBtns) {
  btn.addEventListener('click', getSingleChar)
}


//==============================================================
//getAllOldChars will request a list of character that are older than the age limit we set using the input field from our age form. Our server will filter out anyone that age or younger and give us a new list with the characters that are older than that age. We take that list and use the createCharacterCard function to display them on our page
function getAllOldChars(event) {
  event.preventDefault()
  const age = ageInput.value
  axios.get(`http://localhost:4000/character?age=${age}`)
    .then(res => {
      console.log(res.data)
      clearCharacters();
      const newCharacterArr = res.data
      for (let char of newCharacterArr) {
        createCharacterCard(char)
      }
    })
}

ageForm.addEventListener('submit', getAllOldChars)


//==============================================================
//createNewChar will pull all the values from our input fields inside of our new character form, bundle them into an object(body) and send that new body object along with our requests. The server will return a new array of characters with the added character that we will then display using our createCharacterCard function above. 

function createNewChar(event) {
  event.preventDefault();

  const newLikes = newLikesText.value.split(', ')

  const body = {
    firstName: newFirstInput.value,
    lastName: newLastInput.value,
    gender: newGenderDropDown.value,
    age: parseInt(newAgeInput.value),
    likes: newLikes
  }

  axios.post('http://localhost:4000/character', body)
    .then(res => {
      console.log(res.data)
      clearCharacters();
      const newCharacterArr = res.data
      for (let char of newCharacterArr) {
        createCharacterCard(char)
      }
    })


  newFirstInput.value = ''
  newLastInput.value = ''
  newGenderDropDown.value = 'female'
  newAgeInput.value = ''
  newLikesText.value = ''
}

createForm.addEventListener('submit', createNewChar)