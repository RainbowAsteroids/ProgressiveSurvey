//Programmed by https://github.io/RainbowAsteroids
function saveAs(uri, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    link.href = uri;
    link.download = filename;

    //Firefox requires the link to be in the body
    document.body.appendChild(link);

    //simulate click
    link.click();

    //remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

class Answer { //Awnser data type. Stores the answer option and the result
    constructor(parent){ //Parent should be an ordered list
        this.parent = parent;

        this.mainElement = document.createElement('li');
        this.parent.appendChild(this.mainElement);
		
		//create user inputs
        this.option = document.createElement('input'); this.option.type = "text";
        this.result = document.createElement('input'); this.option.type = "text";
        this.mainElement.appendChild(this.option);
        this.mainElement.insertAdjacentHTML("beforeend"," Output: ");
        this.mainElement.appendChild(this.result);
        this.mainElement.insertAdjacentHTML("beforeend","<br>");
    }

    delete() {this.parent.removeChild(this.mainElement);} //deletes itself
}

class Question {
    constructor(parent,id){ //Parent should be Quiz.mainElement
        this.parent = parent;

        this.mainElement = document.createElement('div'); //We're going to put EVERYTHING in here
        this.parent.appendChild(this.mainElement); //Make sure we don't lose mommy at the store

        //Question title
        this.mainElement.insertAdjacentHTML("beforeend","Question Title: ");
        this.questionTitle = document.createElement('input');
        this.questionTitle.type = "text";
        this.mainElement.appendChild(this.questionTitle)
        this.mainElement.insertAdjacentHTML("beforeend","<br>");

        //We're storing answers here
        this.answersOL = document.createElement("ol");
        this.mainElement.appendChild(this.answersOL);
        this.answersOL.type = "A"; //This type makes the OL read as A, B, C, D
        this.answers = new Array(); // This is the good stuff of the good stuff
        for (var i = 0; i < 4; i++) {this.addAnswerOption();} //How nice for you to make answers for us!

        //add and remove buttons
        var addButton = document.createElement('input'); addButton.type = "button"
        var removeButton = document.createElement('input'); removeButton.type = "button"
        addButton.value = "Add Answer Option";
        removeButton.value = "Remove Answer Option";
        var buttonLi = document.createElement('li');
        buttonLi.insertAdjacentHTML("beforeend","<br>")
        buttonLi.appendChild(addButton);
        buttonLi.insertAdjacentHTML('beforeend',' ');
        buttonLi.appendChild(removeButton);

        var buttonUL = document.createElement('ul');
        this.mainElement.appendChild(buttonUL);

        buttonLi.style = "list-style-type: none;";
        buttonUL.appendChild(buttonLi);

        addButton.onclick = function() {quiz.questions[id].addAnswerOption();}
        removeButton.onclick = function() {quiz.questions[id].removeAnswerOption();}
    }

    addAnswerOption() {
        this.answers.push(
            new Answer(this.answersOL)
        );
    } //adds an answer option
    removeAnswerOption() { //gets rid of an answer option
        this.answers[this.answers.length-1].delete();
        this.answers.pop();
    }
    delete() {this.parent.removeChild(this.mainElement);} //deletes itself
}

class Quiz { //This is the quiz
    constructor(){
        this.mainElement = document.createElement('div'); //We're going to put EVERYTHING in here
        document.body.appendChild(this.mainElement); //Lets add it to the body

        //Quiz title and author
        this.mainElement.insertAdjacentHTML("beforeend","Quiz Title: ");
        this.quizTitle = document.createElement('input'); this.quizTitle.type = "text";
        this.mainElement.appendChild(this.quizTitle);
        this.mainElement.insertAdjacentHTML("beforeend"," Quiz Author: ");
        this.author = document.createElement('input'); this.author.type = "text";
        this.mainElement.appendChild(this.author);
        this.mainElement.insertAdjacentHTML("beforeend","<br><br>") //Add line breaks for questions

        this.questions = new Array(); // This is the good stuff, the questions
        this.questions.push(new Question(this.mainElement, this.questions.length)); // Automagicly add the first question

        //add and remove buttons
        var addButton = document.createElement('input'); addButton.type = "button"
        var removeButton = document.createElement('input'); removeButton.type = "button"
        var finishButton = document.createElement('input'); finishButton.type = "button"
        addButton.value = "Add Question";
        removeButton.value = "Remove Question";
        finishButton.value = "Finish";
        this.buttonElement = document.createElement('span');

        //Adds buttons
		this.buttonElement.appendChild(addButton);
        this.buttonElement.insertAdjacentHTML('beforeend',' ');
        this.buttonElement.appendChild(removeButton);
        this.buttonElement.insertAdjacentHTML('beforeend','<br><br>');
        this.buttonElement.appendChild(finishButton);

        this.mainElement.appendChild(this.buttonElement);

        addButton.onclick = function() {quiz.addQuestion();}
        removeButton.onclick = function() {quiz.removeQuestion();}
        finishButton.onclick  = function() {quiz.compile()}
    }

    addQuestion() { //Create a new question
        this.mainElement.removeChild(this.buttonElement);
        this.questions.push(new Question(this.mainElement, this.questions.length));
        this.mainElement.appendChild(this.buttonElement);
    }
    removeQuestion() { //Get rid of a new question
        this.questions[this.questions.length-1].delete();
        this.questions.pop();
    }

    compile() {
        //This is the JSON we are going to give to the user
        var save_quiz = {"title":this.quizTitle.value, "author":this.author.value, "questions":new Array()};
        this.questions.forEach(function(question) {
            let answers = {}
            question.answers.forEach(function(answer) {
                answers[answer.option.value] = answer.result.value
            })
            save_quiz["questions"].push({
                "title":question.questionTitle.value,
                "answers":answers
            })
        })
	console.log(window.btoa(unescape(encodeURIComponent(JSON.stringify(save_quiz,"",4)))))
        saveAs("data:application/json;charset=utf-8;base64,"+window.btoa(unescape(encodeURIComponent(JSON.stringify(save_quiz,"",4)))), quiz.quizTitle.value+".json");
    }
}

var quiz;
function init(){
    quiz = new Quiz();
}
