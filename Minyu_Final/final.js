$(function() { 
    
    var content= document.getElementById('content');
    var loginSection = document.getElementById('loginSection');
    var showList=document.getElementById('showList');
    
    var information,movieName,newList,movieDetail,$idText,theRow,theColomun;
    var ids='';
    var itemId='';

    
    //function that collects data from the json file
  function loadList(){                //Declare the function
        $.getJSON('final.json')         //Try to collect Json data
        .done(function(data){           //If successful
            information=data;           //Store it in a variable
            console.log(information);
        }).fail(function(){             //If a problem:show message
            $('#event').html('Sorrry! We could not load the information at the moment');
        });
    }
  loadList();                    //Call the function
    
// get the form 
  let form = document.getElementById('login');
 
  form.addEventListener('submit', processSubmit);

   function processSubmit(e){
       e.preventDefault();
		var elements = this.elements;
             let username = elements.username.value;
		let msg = 'Welcome ' + username;
		console.log("message is: "+ msg);
		// Replace the <div>  id main with the message
		document.getElementById('header').textContent = msg;
         content.style.display='block';
        loginSection.setAttribute('class','hide');
        console.log(loginSection);
        
	}; 
  
 
	// changing password input field to be visible or not	
	var pwd = document.getElementById('pwd');
	let chk = document.getElementById('showPwd');
	chk.addEventListener('change', processChange);
    
// if the check box value changes ...
  function processChange(e) {
		let target= e.target || e.srcElement;
		console.log(" pwd = " + pwd);
		try{
			if (target.checked) {
				// if checked, then display the password by changing the password type
				pwd.type = 'text';
			} else {
				// otherwise hide it!
				pwd.type = 'password';
			}
		} catch(error) {
			alert('This browser cannot switch type');
		}
        
	}
    
        var userName = document.getElementById('username');
        
        var loginButton =document.getElementById('submit');
    
/* userName.onkeyup=function(){
        if(userName.value!=''&&pwd.value!=''){
            loginButton.style.display='block';
        }else{
            loginButton.style.display='none';
        }
    }
     pwd.onkeyup=function(){
        if(userName.value!=''&&pwd.value!=''){
            loginButton.style.display='block';
        }else{
            loginButton.style.display='none';  
        }
    }
     
    if(userName.value!=''&&pwd.value!=''){
        loginButton.style.display='block';
    };*/
    
	if(window.localStorage){
        var txtUsername=document.getElementById('username');
        var txtPwd = document.getElementById('pwd');
        txtUsername.value=localStorage.getItem('username');
        txtPwd.value=localStorage.getItem('pwd');
        txtUsername.addEventListener('input',function(){
            localStorage.setItem('username',txtUsername.value);
        },false);
         txtPwd.addEventListener('input',function(){
            localStorage.setItem('pwd',txtPwd.value);
        },false);    
    }
    
// --------Search the movie list-------
  $('#searchForm').on('submit',function(e){
        e.preventDefault();
       $('#showList').addClass('hide');
        movieName=$('#inputField').val().toUpperCase();
        console.log('Now we are going to search the '+ movieName+' in our Json file');
        newList ='';
        var relatedContent="";
        console.log(information);
     if(information[movieName] != null){ // to see if there is one in the Json file
        for(var i=0;i<information[movieName].length;i++){
        relatedContent +=information[movieName][i].time+"-"+information[movieName][i].location+"\n";
        };
        console.log('information of json file for movie'+movieName+ " is: " + '\n' + relatedContent);
        
        for (var i=0;i<information[movieName].length;i++){
            newList +='<li><span class="list">'+information[movieName][i].time+'</span>';
            newList +=" "+information[movieName][i].location+'</li>';
           /* newList +='<li>'+information[movieName][i].location+'<br/>';
            newList +='<span class="list"> '+information[movieName][i].time+'</span></li>';*/
        };
         
        console.log(newList);
        $('#searchList').html('<ul>'+newList+'</ul>');
         
        }else{  // if there is not,ask the user if they want to add to todolist
            var appendAsk='Opps, it seems there is no showtime for '+movieName+' currently. Do you want to add it to your plan though?';
                var addButton=document.createElement('button');          
                addButton.textContent='Yes';
                addButton.setAttribute('id','adButton');
                console.log(addButton.id);
          $('#searchList').html('<p class=\"appendAsk\">'+appendAsk+'<br/><p>');  
            $('p.appendAsk').append(addButton);
        };  
    });

//Add the movie which has no infomation    
 $('#searchList').on('click','#adButton',function(e){
        e.preventDefault();
         $('#toDo').append('<li class="noInfo">'+movieName+'</li>');
        console.log('The new plan is ' + movieName);
         $this=$(this);
         let $parent=$this.parent();
         $parent.empty();
        updateCount(); 
     
      // console.log('it is'+$('#inputField').text());
  });
    
 
    
//-------Plan list---------
    
//set the counter
  function updateCount(){
    var items = $('#toDo li').length;
    $('#counter').text(items);
}    
    updateCount();
    
//add new movie
  $('#two').on('click','#searchList li',function(e){
    e.preventDefault();
    var $this =$(this);
    var cur= $this.hasClass('current');
     //itemId= e.target.textContent;//the li element
     $idText = $this.children('span').text();// the value of id
      
      console.log('the span text is'+$idText +'and the movieName is'+movieName); 
    if (cur === true){
     $this.removeClass('current');
    let removeEl= document.getElementById($idText);//remove the movie from the todo //list
    console.log(removeEl);
    let containerEl=removeEl.parentNode;
    containerEl.removeChild(removeEl);
    
    }else{ 
       var theLength=e.target.textContent.length;
        console.log(theLength);
         if(theLength > 8){
           movieDetail=e.target.textContent;
        }else{
          movieDetail=e.target.parentNode.textContent;     
            
      }
        
         $('#toDo').append('<li class="haveInfo" id="'+$idText+'">'+movieName+'  <span class="hide">'+movieDetail+'</span></li>');

           console.log($idText);
        //$('#searchList li.current').removeClass('current');
        $this.addClass('current');
        this.setAttribute('id',$idText[0]+movieName[0]);
        console.log('The old li have been add the id: '+ this.id);
    } 
     updateCount();
});
    
//show the movie detail
  $('#one').on('mouseover','li',function(){
        this.style.color="green";
        $(this).children('span').removeClass('hide');
    });//show the ids
  $('#one').on('mouseout','li',function(){
      this.style.color=""; 
      $(this).children('span').addClass('hide');
    });
  $('#two').on('mouseover','li',function(){
        this.style.color='orange';
        ids=this.id;
    });//the hover effect of search list
  $('#two').on('mouseout','li',function(){
        this.style.color='';
    });//remove the effect
    
 //remove the items
    var timer=null;
$('#one').on('dblclick','li',function(e){
    
    e.preventDefault();
    ids=this.id;
    $this=$(this);
     $idText = $this.children('span').text();
     $(this).children('span').remove();
    let itemName=$this.text();
    $this.remove();
        clearTimeout(timer);
    updateCount();
    let theId = ids[0]+itemName[0];
   // var $theOld = $(document.getElementById(theId));
    let theOld=document.getElementById(theId);
    console.log('we need to find this: '+theId);
   // $theOld.removeClass('current');
    theOld.style.color='black';
           
});
    
 //complete an item      
  $('#one').on('click','#toDo li',function(e){
    e.preventDefault();
       ids=this.id;
    $this=$(this);
     $idText = $this.children('span').text();
    $(this).children('span').remove();
       clearTimeout(timer);
      timer = setTimeout(function() { 
   let itemName=$this.text();
    $this.remove();
    console.log('this is going to be'+$this.children('span').text());
    $('#completed').append('<li class="complete" id="'+ids+'">'+'<input type=\"checkbox" checked="true">'+itemName+'<span class="hide">'+$idText+'</span></li>').hide().fadeIn(300);
    console.log('the completed item id is '+ ids);
    updateCount();
      },250);
});
  
  //item unchecked  
$('#one').on('click','#completed li',function(e){
    e.preventDefault();
    ids=this.id;
    $this=$(this);
     $idText = $this.children('span').text();
     $(this).children('span').remove();
     clearTimeout(timer);
      timer = setTimeout(function() { 
       let itemName=$this.text();
       $this.remove();
      if ($idText.length>0){
            $('#toDo').append('<li class="haveInfo" id="'+ids+'">'+itemName+'  <span class="hide">'+$idText+'</span></li>')
      }else{
          $('#toDo').append('<li class="noInfo" id="'+ids+'">'+itemName+'</li>');
      }    
    console.log('the movie name again is'+itemName);
    updateCount();              
        }, 250); 
  
});

    // the effect when hover on the posters
 $('#showList').on('mouseover','#poster td',function(){
  
     var $post = $(this);
     var $control = $('#showList').find('#poster td');
     console.log($control);
     var theNo = $control.index($post);
     console.log('The poster index is '+theNo);
      $post.css('border','1px solid #678576');
     var $postName= $('#names').find('td').eq(theNo);
     $postName.css('color','green');       
 }); 
  $('#showList').on('mouseout','#poster td',function(){
  
     var $post = $(this);
     var $control = $('#showList').find('#poster td');
     console.log($control);
     var theNo = $control.index($post);
     console.log('The poster index is '+theNo);
      $post.css('border','0px');
     var $postName= $('#names').find('td').eq(theNo);
     $postName.css('color','black');       
 }); 
    //Click on the posters
    $('#showList').on('click','#poster td',function(e){
  
     var $post = $(this);
     var $control = $('#showList').find('#poster td');
     console.log($control);
     var theNo = $control.index($post);
     var posterName= $('#names').find('td').eq(theNo).text().toUpperCase();
    movieName=posterName.toUpperCase();
     console.log('the moviename is'+movieName);
     e.preventDefault();
      newList ='';
        var relatedContent="";
        console.log(information);
        for(var i=0;i<information[movieName].length;i++){
        relatedContent +=information[movieName][i].time+"-"+information[movieName][i].location+"\n";
        };
        console.log('information of json file for movie'+movieName+ " is: " + '\n' + relatedContent);
        
        for (var i=0;i<information[movieName].length;i++){
            newList +='<li><span class="list">'+information[movieName][i].time+'</span>';
            newList +=" "+information[movieName][i].location+'</li>';
            
        };         
         console.log(newList);
         $('#showList').addClass('hide');
        $('#searchList').html('<ul>'+newList+'</ul>');
 }); 
    
    // The hover effect and click on the names
 $('#showList').on('mouseover','#names td',function(){
  
     var $post = $(this);
     var $control = $('#showList').find('#names td');
     console.log($control);
     var theNo = $control.index($post);
     console.log('The poster index is '+theNo);
     $post.css('color','green');  
     var $poster= $('#poster').find('td').eq(theNo);
      $poster.css('border','1px solid #678576');      
 }); 
  $('#showList').on('mouseout','#names td',function(){
  
     var $post = $(this);
     var $control = $('#showList').find('#names td');
     console.log($control);
     var theNo = $control.index($post);
     console.log('The poster index is '+theNo); 
     $post.css('color','black');  
     var $poster= $('#poster').find('td').eq(theNo);
      $poster.css('border','0px');  
 });    
    
$('#showList').on('click','#names td',function(e){
  
     var $post = $(this);
     var $control = $('#showList').find('#names td');
     console.log($control);
     
     var posterName= $post.text().toUpperCase();
    movieName=posterName.toUpperCase();
     console.log('the moviename is'+movieName);
     e.preventDefault();
      newList ='';
        var relatedContent="";
        console.log(information);
        for(var i=0;i<information[movieName].length;i++){
        relatedContent +=information[movieName][i].time+"-"+information[movieName][i].location+"\n";
        };
        console.log('information of json file for movie'+movieName+ " is: " + '\n' + relatedContent);
        
        for (var i=0;i<information[movieName].length;i++){
            newList +='<li><span class="list">'+information[movieName][i].time+'</span>';
            newList +=" "+information[movieName][i].location+'</li>';
            
        };         
         console.log(newList);
         $('#showList').addClass('hide');
        $('#searchList').html('<ul>'+newList+'</ul>');
 });     
    //store the user information into the local storage   
    /*if(window.localStorage){
        var infoToDo=document.getElementById('toDo');
        var infoCompleted=document.getElementById('completed');
        infoToDo.value = localStorage.getItem('toDo');
        infoCompleted.value=localStorage.getItem('completed');
        function uploadInfo(){
        localStorage.setItem('toDo',infoToDo.value);
        localStorage.setItem('completed',infoCompleted.value);
        }
        uploadInfo();
    }*/
//set some default movie
/*for(var i=0;i<3;i++){
    theRow=document.createElement('tr');
     showList.appendChild(theRow);
    for (var j=0;j<2;j++){
         theColomun=document.createElement('td');
        theRow.appendChild(theColomun);
    }
  
    //theColomun[0].html('');
  };
   console.log(theRow.value);*/
}); 