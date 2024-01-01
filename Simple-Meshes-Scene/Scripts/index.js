const SYNCHRONIZATIONPARAMS = {
    HOST: "3.227.234.35",
    PORT: 15526,
    TLS: false,
    TRANSPORT: "websocket"
};

const SESSIONINFO = {
    id: "ba8e3de0-4a5d-4ca8-9841-ae78fb12e0a4",
    tag: "test"
};

let characterSynchronized = false;
let characterLoaded = false;
let sessionJoined = false;
let userName = null;
let interfaceMode = null;

HandleQueryParams();

SetButtonControls();

let vosSynchronizer = new VOSSynchronizer(SYNCHRONIZATIONPARAMS.HOST, SYNCHRONIZATIONPARAMS.PORT,
    SYNCHRONIZATIONPARAMS.TLS, SYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
let thirdPersonCharacter = new ThirdPersonCharacter(userName, null, -90, 90, 1, 0.1, new Vector3(0, 0, 0), OnCharacterLoaded, interfaceMode);
vosSynchronizer.Connect();

Time.SetInterval(`
    if (!characterSynchronized) {
        if (characterLoaded && sessionJoined) {
            vosSynchronizer.AddEntity(thirdPersonCharacter.characterEntityID, true);
            sessionJoined = true;
            characterSynchronized = true;
        }
    }
`, 0.1);

function HandleQueryParams() {
    userName = World.GetQueryParam("USER_NAME");
    interfaceMode = World.GetQueryParam("IF_MODE");
    if (interfaceMode === "desktop") {
        
    }
    else if (interfaceMode === "vr") {
        
    }
    else if (interfaceMode === "mobile") {
        
    }
    else {
        Logging.Log("Interface Mode not set or invalid. Defaulting to desktop.");
        interfaceMode = "desktop";
    }
}

function SetButtonControls() {
    var controlsEntity = Entity.GetByTag("Controls");
    if (controlsEntity === null) {
        Logging.LogError("SetButtonControls: Could not get controls.");
        return;
    }
    
    if (interfaceMode === "mobile") {
        controlsEntity.SetVisibility(true);
    }
    else {
        controlsEntity.setVisibility(false);
    }
}

function OnConnect() {
    
}

function OnJoinSession() {
    sessionJoined = true;
}

function OnCharacterLoaded() {
    characterLoaded = true;
}