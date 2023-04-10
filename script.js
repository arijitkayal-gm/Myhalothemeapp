console.log("Halo");
//Variables
let songIndex=1;
let pauseIndex=false;
let audioElement=new Audio('songs/1.mp3');
let masterPlay=document.getElementById("masterPlay");
let gif=document.getElementById("gif");
let progressBar=document.getElementById("progressBar");
let songItem=Array.from(document.getElementsByClassName("songItem"));
let masterSongName=document.getElementById("masterSongName");
let songs = [
    {songName: "Halo CE Theme", filepath: "song/1.mp3", coverPath: "covers/cover1.jpg", duration:"02:57"},
    {songName: "Halo CE Didactic Principal", filepath: "song/2.mp3", coverPath: "covers/cover1.jpg", duration:"01:47"},
    {songName: "Halo 2 Mjolnir Mix", filepath: "song/3.mp3", coverPath: "covers/cover2.jpg", duration:"04:09"},
    {songName: "Halo 2 Heretic, Hero", filepath: "song/4.mp3", coverPath: "covers/cover2.jpg", duration:"02:34"},
    {songName: "Halo 2 Heavy Price Paid", filepath: "song/5.mp3", coverPath: "covers/cover2.jpg", duration:"02:32"},
    {songName: "Halo 3 Finish the Fight", filepath: "song/6.mp3", coverPath: "covers/cover3.jpg", duration:"02:27"},
    {songName: "Halo 3 ODST Finale", filepath: "song/7.mp3", coverPath: "covers/cover4.jpg", duration:"8:12"},
    {songName: "Halo 3 ODST The Rookie", filepath: "song/8.mp3", coverPath: "covers/cover4.jpg", duration:"07:29"},
]
let arrayOfSongItemPlay=Array.from(document.getElementsByClassName('songItemPlay'));
console.log(arrayOfSongItemPlay[songIndex])


songItem.forEach((element,i)=>{
    
    element.getElementsByTagName("img")[0].src=songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText=songs[i].songName;
    
    //console.log(element.getElementsByClassName("songName"),i);
})
//audioElement.play();

//function to play a song
const playSong=()=>{
    console.log(songIndex,audioElement.currentTime,audioElement.src)
    masterSongName.innerHTML=songs[songIndex-1].songName;
    //if else to check if same song then play from where it was left
    //original pc url="http://127.0.0.1:5500/songs/${songIndex}.mp3"
    //for github hosting use"https://arijitkayal-gm.github.io/Myhalothemeapp/${songIndex}.mp3"
    //for own ip while playing any song in console see the link it generates and use it here and replace name of mp3 with string interpolation
    if(audioElement.src==`https://arijitkayal-gm.github.io/Myhalothemeapp/songs/${songIndex}.mp3`){
        //console.log(`matched`)
        audioElement.play();
    }else{
        //console.log(`not matched`);
        audioElement.src=`songs/${songIndex}.mp3`;
        audioElement.currentTime=0;
        audioElement.play();
    }
    makeallPlay();
    arrayOfSongItemPlay[songIndex-1].classList.remove('fa-play');//pseudo
    arrayOfSongItemPlay[songIndex-1].classList.add('fa-pause');
    masterPlay.classList.remove('fa-play');
    masterPlay.classList.add('fa-pause');
    gif.style.opacity=1;
    
}

//function to pause song
const pauseSong=()=>{
    audioElement.pause();
    makeallPlay();
    arrayOfSongItemPlay[songIndex-1].classList.remove('fa-pause');//pseudo
    arrayOfSongItemPlay[songIndex-1].classList.add('fa-play');
    masterPlay.classList.remove('fa-pause');
    masterPlay.classList.add('fa-play');
    gif.style.opacity=0;
}

//Events

//Play&Pause
masterPlay.addEventListener("click",()=>{
    if(audioElement.paused || audioElement.currentTime <=0){
        playSong();
        
    }else{
       pauseSong();
       
    }
})
//Progressbar
audioElement.addEventListener('timeupdate',()=>{
    console.log("update");
    //update progressbar
    progressBar.value=(audioElement.currentTime/audioElement.duration)*100;
    if(progressBar.value==100){
        //console.log("next song please")
        songIndex++;
        if(songIndex>8){
            songIndex=1;
        }
        playSong();
    }

})
progressBar.addEventListener('change',()=>{
    audioElement.currentTime=(progressBar.value*audioElement.duration)/100;
})


const makeallPlay=()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((e)=>{
        e.classList.remove('fa-pause');
        e.classList.add('fa-play');
        
    })
}
//playing song from list
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
    element.addEventListener('click',(e)=>{
        //console.log(e.target.id)
        makeallPlay();
        if(parseInt(e.target.id)==songIndex){
            if(audioElement.paused){
               pauseIndex=true; 
            }else{
                pauseIndex=false;
            }
            
        }else{
            pauseIndex=true;
        }
        songIndex=parseInt(e.target.id);
        
        e.target.classList.remove('fa-play');
        e.target.classList.add('fa-pause');
        console.log(songIndex,pauseIndex);
        if(pauseIndex){
            playSong();
        }else{
           pauseSong(); 
        }
    })
})

//previous
document.getElementById('previous').addEventListener('click',()=>{
    if(songIndex<=1){
        songIndex=8;
    }else{
        songIndex-=1;
    }
    playSong();
})

//next
document.getElementById('next').addEventListener('click',()=>{
    if(songIndex>=8){
        songIndex=1;
    }else{
        songIndex+=1;
    }
    playSong();
})