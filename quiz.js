//Programmed by https://github.io/RainbowAsteroids
var file;
var mainElement = document.createElement('div');
function readFile(element) { //Handle the inputted file
    file = element.files[0];
    var reader = new FileReader();
    var quiz = ""
    reader.onload = function() {init(reader.result);}
    reader.readAsText(file); //Send it on to the quiz creator
}

function init(data) {

    document.body.removeChild(document.getElementById('upload'));
    document.body.appendChild(mainElement);
    quizData = JSON.parse(data); //Parse the data for JSON
    console.log("%cInputted JSON data:", "background-color: yellow; font-size: large");
    console.log(quizData); //Debug Output

    mainElement.insertAdjacentHTML("beforeend","<h1>"+quizData["title"]+"</h1>"); //Quiz Metadata
    mainElement.insertAdjacentHTML("beforeend","<h2>"+quizData["author"]+"</h2>");

    let i = -1
    quizData["questions"].forEach(function(question) { //Setup the question
        i++
        mainElement.insertAdjacentHTML("beforeend","<h3>"+question["title"]+"</h3>");
        let options = document.createElement("ol"); options.type = "A"
        for (option in question["answers"]) {
            let li = document.createElement("li");
            let input = document.createElement("input");
            input.type = "radio"; input.name = question["title"]; input.value = option; input.id = i.toString();
            li.appendChild(input); li.insertAdjacentHTML("beforeend",option);
            options.appendChild(li);
        } mainElement.appendChild(options); //Append this to the body
    });
    var finish = document.createElement("input");
    finish.type = "button";
    finish.value = "Finish";
    finish.onclick = function() {results(quizData)};
    mainElement.appendChild(finish); mainElement.insertAdjacentHTML("beforeend", "<br><br>")
}

function results(data) {
    for (element of mainElement.getElementsByClassName("error")) {
        mainElement.removeChild(element);
    }
    var inputs = new Array();
    var pass = true;
    data["questions"].forEach(function(question) {
        let answered = false;
        for (input of document.getElementsByName(question["title"])) {
            if (input.checked) {inputs.push(input.cloneNode());answered = true;continue;}
        };
        pass = answered; //If user didn't answer any questions, don't execute the second half of this function
        if (!answered) { //make sure user answered the questions
            mainElement.insertAdjacentHTML("beforeend",'<b class="error">You did not answer question "'+question["title"]+'"!<br></b>');
        }
    }); if (!pass) {return;} //Stop this function if there are unanswered questions

    document.body.removeChild(mainElement);
    mainElement = document.createElement("div");
    document.body.appendChild(mainElement);
    document.body.insertAdjacentHTML("afterbegin", "<h2>Quiz Results</h2>");
    var output = document.createElement('p'); mainElement.appendChild(output);

    inputs.forEach(function(element) {
        output.insertAdjacentHTML("beforeend", data["questions"][Number(element.id)]["answers"][element.value]+" ");
    })
    output.insertAdjacentHTML("beforeend","<br>");
    mainElement.insertAdjacentHTML("beforeend","<hr><footer>Thank you for taking the survey \""+data["title"]+"\" by "+data["author"]+" and for using <a href=\"https://github.com/RainbowAsteroids/ProgressiveSurvey\"><b>Progressive Survey</b></a>!</footer>")
}
