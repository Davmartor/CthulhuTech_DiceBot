const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

const prefix = "/";

client.on("message", function(message) {
  if (message.author.bot) return;
  if(!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  if (command === "r") {

    
    dices = args.shift()
    if (!dices.match(/(\d{1,2})d(.*)/g)) { 
      message.reply("Command dice wrong. Try Again.");
      return;
      }
    diceNums = dices.split('d');

    const ARRAY_LENGTH = parseInt(diceNums[0]);
    const NUMBER_FACES = parseInt(diceNums[1]);
    randomArray = [];
    for (let i = 0; i<ARRAY_LENGTH; i++) {
      randomArray.push(Math.floor(Math.random() * (NUMBER_FACES - 1) + 1));
    }
    randomArray = randomArray.sort(function(a, b){return a - b});

    //get the bigger number
    numMayor = randomArray[ARRAY_LENGTH-1];

    //get count of every faces in the roll
    facesArray = Array(NUMBER_FACES);

    for (let i = 0; i<ARRAY_LENGTH; i++){
        if (!facesArray[randomArray[i]-1]){ 
        facesArray[randomArray[i]-1] = 1;
      } else {
        facesArray[randomArray[i]-1] += 1;  
      }
      
    }

     //get the bigger sum of same numbers
    let sumIguales = 0;
    let indicadorIguales = 0;

    for (let i = 0; i<NUMBER_FACES; i++){
      sum = facesArray[i] * (i+1); 
	if (sum > sumIguales ){
	  sumIguales = sum;
	  indicadorIguales = i+1;
	}
	
    }


    
    //get the sum of straigth
    let sumEscalera = 0;
    let sumEscPrev = 0;
    let indicadorTop = 0;
    let indicadorBottom = 0;
    if (NUMBER_FACES > 2){
      for (let i = NUMBER_FACES-1; i >= 0; i--){
        if ( facesArray[i]>0 ) {
          if(!indicadorTop) indicadorTop = i;
          indicadorBottom = i;
          sumEscalera += (i+1); 
        }else{
          if( ( indicadorTop - indicadorBottom ) >= 2 ){
            break;}
          else {
                       
            indicadorTop = 0;
            sumEscalera = 0;
          }

        }
      }
    }

    message.reply(`Ha lanzado ${ARRAY_LENGTH} dado${(ARRAY_LENGTH > 1)?'s':''} de ${NUMBER_FACES}.`);
   
	arrayCheck = Array(NUMBER_FACES); 
let totalSum = 0;
let resultado = "";
	if (numMayor >= sumIguales && numMayor >= sumEscalera ){
	    for (let i = 0; i<ARRAY_LENGTH-1; i++) { resultado += `${randomArray[i]}, `;}
	    resultado += `**${randomArray[ARRAY_LENGTH-1]}** `; 
	    totalSum = numMayor;
		
	}else if (sumIguales >= sumEscalera ){
	    for (let i = 0; i<ARRAY_LENGTH; i++) { 
		    if (randomArray[i]==indicadorIguales) randomArray[i] = "**"+randomArray[i]+"**"; 
	    }
	    resultado = randomArray.join(",");
	    totalSum = sumIguales;

	}else {
      
         
	    for (let i = 0; i<ARRAY_LENGTH; i++) { 
		    if (randomArray[i] >= indicadorBottom && randomArray[i] <= indicadorTop ) {
          if(arrayCheck[randomArray[i]-1] != 1){ 
            arrayCheck[randomArray[i]-1] = 1;
            randomArray[i] = "**"+randomArray[i]+"**"; 
          }
          
        }
       
	    }
    resultado = randomArray.join(",");
		totalSum = sumEscalera;
	}



    
    message.reply(resultado);
    message.reply(`El resultado es **${totalSum}**.` );

  }
});

client.login(config.BOT_TOKEN);
