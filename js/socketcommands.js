let je = null;
let game = null;
let sportdata = null;
let t1data = null;
let t2data = null;
let t1color;
let t2color;
let selectedteam = 0;
let sport="default";
let FusDown=1;
let FusDistance=10;
let BaseballBases=[];
function setgames() {


sport=game.sport;
    FusDown=game.FusDown;
    FusDistance=game.FusDistance;
    BaseballBases=game.BaseballBases;
    
    t1color = toColor(game.Team1.PrimaryColor);
    t2color = toColor(game.Team2.PrimaryColor);

    document.getElementById('t1color').style.backgroundColor = t1color.toString();
    document.getElementById('t1name').textContent = game.Team1.Abrev;
    document.getElementById('t1city').textContent = game.Team1.City;

    document.getElementById('t1score').textContent = game.Team1GlobalScore.toString();

    document.getElementById('T1Selector').textContent = game.Team1.Name;

    document.getElementById('t2color').style.backgroundColor = t2color.toString();
    document.getElementById('t2name').textContent = game.Team2.Abrev;
    document.getElementById('t2city').textContent = game.Team2.City;
    document.getElementById('t2score').textContent = game.Team2GlobalScore.toString();

    UpdateScores();
    document.getElementById('T2Selector').textContent = game.Team2.Abrev;

    game.hasovertime = sportdata.hasovertime;

    document.getElementById('ScoringPanel').innerHTML = "";
    sportdata.scoring.forEach(e => {
        CreateEventButton(e, 'ScoringPanel', 'ScoringButton', 'scoring', selectedteam)
    });

    document.getElementById('FoulPanel').innerHTML = "";
    sportdata.fouls.forEach(e => {
        CreateEventButton(e, 'FoulPanel', 'FoulButon', 'foul', selectedteam)
    });

    document.getElementById('EventPanel').innerHTML = "";
    sportdata.events.forEach(e => {
        CreateEventButton(e, 'EventPanel', 'EventButton', 'event', selectedteam)
    });

    //-------------------
    document.getElementById('ScoringPanel2').innerHTML = "";
    sportdata.scoring.forEach(e => {
        CreateEventButton(e, 'ScoringPanel2', 'ScoringButton', 'scoring', 1)
    });

    document.getElementById('FoulPanel2').innerHTML = "";
    sportdata.fouls.forEach(e => {
        CreateEventButton(e, 'FoulPanel2', 'FoulButon', 'foul', 1)
    });

    document.getElementById('EventPanel2').innerHTML = "";
    sportdata.events.forEach(e => {
        CreateEventButton(e, 'EventPanel2', 'EventButton', 'event', 1)
    });

    UpdatePlayerList(1);
    UpdatePlayerList(2);
    GetPeriods();
}


function CreateEventButton(e, panelid, style, type, teamid) {
    var b = document.createElement('button');
    try {


        b.classList.add(style);
        b.innerHTML = e.Abrev;
        b.onclick = function () {
            console.log('send ' + type + ':' + e.Amount + 'pts, event name:' + e.Text + ' for team ' + teamid);

            switch (type) {
                case 'scoring':
                    socket.emit('Set Scoring', teamid, e.Text, e.Amount, room, name);
                    break;
                case 'foul':
                    socket.emit('Set Foul', teamid, e.Text, e.Amount, room, name);
                    break;
                case 'event':
                    socket.emit('Set Event', teamid, e.Text, e.Amount, room, name);

                    break;
            }
            return false;
        };
        document.getElementById(panelid).appendChild(b);
    } catch {

    }
}

function UpdatePlayerList() {
    //clear list
    var teamlist = game.Team1.PeopleList;
    if (selectedteam == 1) {
        teamlist = game.Team2.PeopleList
    }
    document.getElementById('PlayersPanel').innerHTML = "";
    teamlist.forEach(p => {
        var b = document.createElement('button');
        b.classList.add("PlayerButton");
        b.innerHTML = p.Numero;
        b.onclick = function () {
            socket.emit('Show People', selectedteam, p._id, p.Extradata, room, name);
        };
        document.getElementById('PlayersPanel').appendChild(b);
        //};
    });
}

function UpdatePlayerList(teamid) {
        var teamlist;

    //clear list
    if(teamid==1)
        {
            teamlist = game.Team1.PeopleList;
                document.getElementById('PlayersPanel').innerHTML = "";
    teamlist.forEach(p => {
        var b = document.createElement('button');
        b.classList.add("PlayerButton");
        b.innerHTML = '<span class="buttontext">'+p.Numero+'<small style=font-weight:300" class="buttontext">'+p.Name+'</small></span>';
        b.onclick = function () {
            socket.emit('Show People', teamid, p._id, p.Extradata, room, name);
        };
        document.getElementById('PlayersPanel').appendChild(b);
    });
        }
    else
    if(teamid==2)
        {
            teamlist = game.Team2.PeopleList
                document.getElementById('PlayersPanel2').innerHTML = "";
    teamlist.forEach(p => {
        var b = document.createElement('button');
        b.classList.add("PlayerButton");
        b.innerHTML = p.Numero+" | "+p.Name;
        b.onclick = function () {
            socket.emit('Show People', teamid, p._id, p.Extradata, room, name);
        };
        document.getElementById('PlayersPanel2').appendChild(b);
    });
        }

}
    
function UpdateScores() {
    document.getElementById('t1score').textContent = game.Team1GlobalScore.toString();
    document.getElementById('t2score').textContent = game.Team2GlobalScore.toString();
}

function GetPeriods() {
    //clear list
    document.getElementById('periodsPanel').innerHTML = "";
    var totalperiods = game.Periods;
    if (game.hasovertime) {
        totalperiods += 1;
    }
    for (let i = 0; i < totalperiods; i++) {

        var b = document.createElement('button');
        b.classList.add("button-period");
        b.innerHTML = i + 1;
        if (i >= game.Periods) {
            b.innerHTML = game.OvertimeAbrev;
        }
        b.onclick = function (e) {
            console.log('set period' + i);
            UpdateGamePeriod(e);
            socket.emit('Set Period', i, room, name);
            return false;
        };
        document.getElementById('periodsPanel').appendChild(b);
    };
}

function UpdateGamePeriod(e, period) {

    p = document.getElementById('periodsPanel').children;
    console.log(p)
    for (let i = 0; i < p.length; i++) {
        var item = p[i];
        item.style.borderBottom = "4px solid #fff";
    }
    e.target.style.borderBottom = "4px solid #ff003c";
};
    


function SetCurrentTeam(teamid) {
    selectedteam = teamid;
    UpdatePlayerList();

    var panel = document.getElementById('TabPanel').children;
    if (teamid == 0) {
        item = panel[1].style.borderBottom = "4px solid transparent";
        item = panel[0].style.borderBottom = "4px solid #ff003c";
        document.getElementById("bkg").style.backgroundColor = t1color
    } else {
        item = panel[0].style.borderBottom = "4px solid transparent";
        item = panel[1].style.borderBottom = "4px solid #ff003c";
        document.getElementById("bkg").style.backgroundColor = t2color
    }


}
       function SetDowns(e, down) {

    p = document.getElementById('DownBtns').children;
    console.log(p)
    for (let i = 0; i < p.length; i++) {
        var item = p[i];
        item.style.backgroundColor = " rgb(38 41 50)";
    }
    e.style.backgroundColor = "orange";
       FusDown=parseInt(down);
           if(FusDown==1)
               {
                   SetDistanceReset();
               }
           
}; 
function SetDistanceReset()
    {
        document.getElementById("fusdistanceNumber").value=10;
         document.getElementById("fusdistanceRange").value=10;
        //SetDowns(document.getElementById('DownBtns').children[0], 1);
        SetDownAndDistance();
    }
    function SetDownAndDistance()
    {
        var dist = parseInt(document.getElementById("fusdistanceNumber").value);
        socket.emit('SetDowns', FusDown, FusDistance, room, name);
        
    }
    
    function UpdateDownSlider(e){
        FusDistance=parseInt(e.value);
        document.getElementById("fusdistanceRange").value=FusDistance;
    }
    function UpdateDownInput(e){
        FusDistance=parseInt(e.value);
        document.getElementById("fusdistanceNumber").value=FusDistance;
    }
    
var getgames = function (msg, Name) {

    games = JSON.parse(msg);


}
function SetTimerPanel(isreversed){
    if(isreversed==true){
        document.getElementById('timeruppanel').style.display="none";
        document.getElementById('timerdownpanel').style.display="flex";
        chronoReset();
    }
    else{
        document.getElementById('timeruppanel').style.display="flex";
        document.getElementById('timerdownpanel').style.display="none";
    }
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = 1;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}
//game request
socket.on('InitGame', function (g, sd, targetName) {
    if (name == targetName) {
        game = g;
        game = JSON.parse(g);

        sportdata = JSON.parse(sd);
        if (sd.sport=="football us"){
            document.querySelector("Fus").style.display="none";
        }
        else{
            document.querySelector("Fus").style.display="block";
        }
        
        setgames();
        SetTimerPanel(sportdata.UseCountdown);
    }


});
    
    

socket.on('UpdateScoring', function (t1score, t2score, Name) {
    game.Team1GlobalScore = t1score;
    game.Team2GlobalScore = t2score;
    UpdateScores();


});

socket.on('Set Period', function (period, Name) {
    p = document.getElementById('periodsPanel').children;
    console.log(p)
    for (let i = 0; i < p.length; i++) {
        var item = p[i];
        if (i == period) {
            p[i].style.borderBottom = "4px solid #ff003c";

        } else {
            item.style.borderBottom = "4px solid #fff";

        }
    }

});
    
    socket.on('Set Down', function (down, distance) {
   FusDown=parseInt(down);
        SetDowns(SetDowns(document.getElementById('DownBtns').children[down-1], FusDown));
        FusDistance=parseInt(distance);
         document.getElementById("fusdistanceNumber").value=distance;
         document.getElementById("fusdistanceRange").value=distance;

});

socket.on('Timer Set', function (min, sec, Name) {
    chronoStop();
    if (min < 10) {
        min = "0" + min
    }
    if (sec < 10) {
        sec = "0" + sec
    }
    document.getElementById('minutes').value = min;
    document.getElementById('seconds').value = sec;

});

socket.on('Timer Start', function (value, room, Name) {
    chronoContinue();
    istimerrunning=true;
    document.getElementById("playpausebtn").innerHTML='<i data-feather="pause-circle" ></i>';
    feather.replace();


});

socket.on('Timer Stop', function (value, room, Name) {
    chronoStop();
    istimerrunning=false
     document.getElementById("playpausebtn").innerHTML='<i data-feather="play-circle" ></i>';
    feather.replace();

});

    socket.on('Timer Reset', function (value, Name) {
        chronoStop();
    chronoReset();
        istimerrunning=false
         document.getElementById("playpausebtn").innerHTML='<i data-feather="play-circle" ></i>';
    feather.replace();

});

//clock
var startTime = new Date(0)
var timerinit = true;
var start = 0
var end = 0
var diff = new Date()
var timerID = 0
var offset = new Date(0);

function chrono() {
    var offset = new Date(new Date(0).setSeconds(document.getElementById("seconds").value) +
        new Date(0).setMinutes(document.getElementById("minutes").value)
    )

    console.log("diff:"+diff)
    end = new Date()
    diff = end - start
    diff = new Date(diff)
    var msec = diff.getMilliseconds()
    var sec = diff.getSeconds()
    var min = diff.getMinutes()
    var hr = diff.getHours() - 1
    
    if (min < 10) {
        min = "0" + min
    }
    if (sec < 10) {
        sec = "0" + sec
    }
    if (msec < 10) {
        msec = "00" + msec
    } else if (msec < 100) {
        msec = "0" + msec
    }
    document.getElementById("minutes").value = min;
    document.getElementById("seconds").value = sec;
    
    GetTimeFromTimer(diff);
    
    
    timerID = setTimeout("chrono()", 100)
}

    function GetTimeFromTimer(diff){
        var maxtime=new Date();
    maxtime.setHours(0,game.Gametime,0);
    maxtime=new Date(maxtime-diff);
    console.log(maxtime);
    
    
    var msecinv = maxtime.getMilliseconds()
    var secinv = maxtime.getSeconds()
    var mininv = maxtime.getMinutes()
    var hrinv = maxtime.getHours() - 1
    
    
    if (mininv < 10) {
        mininv = "0" + mininv
    }
    if (secinv < 10) {
        secinv = "0" + secinv
    }
    if (msecinv < 10) {
        msecinv = "00" + msecinv
    } else if (msecinv < 100) {
        msecinv = "0" + msecinv
    }
    document.getElementById("minutesinv").value = mininv;
    document.getElementById("secondsinv").value = secinv;
    //console.log(min+':'+sec)
    }
    
function chronoStart() {

    start = new Date()
    startTime = new Date(0)
    chrono()
    timerinit = true;
}

function chronoContinue() {
    if (diff == null) {
        diff = new Date()
    }
    //diff = new Date(
    diff.setSeconds(document.getElementById("seconds").value) +
        diff.setMinutes(document.getElementById("minutes").value) //)
    start = new Date() - diff

    start = new Date(start)

    chrono()
}

function chronoReset() {
    //document.getElementById("chronotime").innerHTML = "0:00:00:000"
    start = new Date()
    timerinit = false;
    document.getElementById("minutes").value = "00";
    document.getElementById("seconds").value = "00";
    GetTimeFromTimer(new Date(0));
}

function chronoStopReset() {
    //document.getElementById("chronotime").innerHTML = "0:00:00:000"
}

function chronoStop() {
    clearTimeout(timerID)
}

function SendTime() {
    socket.emit('Timer Set', parseInt(document.getElementById('minutes').value), parseInt(document.getElementById('seconds').value), room, name);
    var d0= new Date(0);
    d0.setMinutes(parseInt(document.getElementById('minutes').value),parseInt(document.getElementById('seconds').value))
    GetTimeFromTimer(new Date(d0));
    
    
}
    
    function SendTimeInv() {
        var min=(game.Gametime-1)-parseInt(document.getElementById('minutesinv').value);
        if(min>game.Gametime){min=game.Gametime}
        var sec=60-parseInt(document.getElementById('secondsinv').value);
        if(sec==60){sec=0;}
    socket.emit('Timer Set', min, sec, room, name);
}
    
    function ResetTimer(){
        socket.emit('Timer Reset', '',room,name)
        
    }

