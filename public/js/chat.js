const socket = io()
//elements
const $messageFrom = document.querySelector('#msg-form')
const $messageFromInput = document.querySelector('input')
const $messageFromButton = document.querySelector('button')
const $messages = document.querySelector('#messages')
const $sendLocation = document.querySelector('#send-location')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username , room }=  Qs.parse(location.search, { ignoreQueryPrefix:true })

const autoscroll = ()=>{
    //new msg element
    const $newMessage = $messages.lastElementChild

    //height of new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight    

    //height of msg container
    const containerHeight = $messages.scrollHeight
 
    //how far have i scrolled?
    const scrolloffset = $messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight <= scrolloffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
}) 

socket.on('locationMessage' , (locationUrl)=>{
    const html = Mustache.render(locationTemplate,{
        username:locationUrl.username,
        url: locationUrl.url,
        createdAt : moment(locationUrl.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageFrom.addEventListener('submit' , (e)=>{
    e.preventDefault()

    $messageFromButton.setAttribute('disabled','disabled')  //disable send button

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{

        $messageFromButton.removeAttribute('disabled')  //enable send button
        $messageFromInput.value = ''
        $messageFromInput.focus()

        if(error){
            return console.log(error);
        }

        console.log('The message was delivered');
    })
})

$sendLocation.addEventListener('click' , (e)=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        },()=>{
            $sendLocation.removeAttribute('disabled')
            console.log('Location Shared'); 
        })
    })
})

socket.on('sendMessage',(message)=>{
    console.log(message)
})

socket.emit('join' , {username, room } , (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})