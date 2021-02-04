var codeArea = ace.edit("codeArea");

document.getElementById("compile").addEventListener("click", compileCode);

function compileCode(){
    let code = codeArea.getValue();
    let langId = document.getElementById("language")[document.getElementById("language").selectedIndex].id;

    sendData(code, langId);
}

function sendData(code, langId){
    axios.post('https://cors-anywhere.herokuapp.com/https://codequotient.com/api/executeCode', 
    {
        code: code,
        langId: langId
    }, 
    {
        headers: {
            'Content-Type' : 'application/json'
        }
    }).then((res)=>{
        getResult(res.data)
    })
    .catch((error) => {
        console.log(error)
    })
}

async function getResult (data){
    console.log(data.codeId)
    await axios.get(`https://cors-anywhere.herokuapp.com/https://codequotient.com/api/codeResult/${data.codeId}`).then((res)=>{
    
    let result = JSON.parse(res.data.data);

    if(result.status === "Pending"){
        document.getElementById("outputArea").innerHTML = "Compiling..."
        getResult(data);
    }
    else if(result.errors === ""){ 
        console.log(result)
        document.getElementById("outputArea").innerHTML = result.output
    } else {
        document.getElementById("outputArea").innerHTML = result.errors
    }

    }).catch((err)=>{
        console.log(err)
    })
}