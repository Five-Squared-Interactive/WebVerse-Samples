const WEBGLSYNCHRONIZATIONPARAMS = {
    HOST: "mqtt.webverse.info",
    PORT: 15526,
    TLS: true,
    TRANSPORT: "websocket"
};

const FOCUSEDSYNCHRONIZATIONPARAMS = {
    HOST: "mqtt.webverse.info",
    PORT: 15525,
    TLS: false,
    TRANSPORT: "tcp"
};

const SESSIONINFO = {
    id: "7f9f8c8e-0aac-4fbc-99fe-00d4a654f8a9",
    tag: "ColumbusCircle"
};

let characterSynchronized = false;
let characterLoaded = false;
let sessionJoined = false;
let userName = null;
let interfaceMode = null;
let runtimeMode = null;

HandleQueryParams();

SetButtonControls();

let vosSynchronizer = null;
if (runtimeMode === "webgl") {
    vosSynchronizer = new VOSSynchronizer(WEBGLSYNCHRONIZATIONPARAMS.HOST, WEBGLSYNCHRONIZATIONPARAMS.PORT,
        WEBGLSYNCHRONIZATIONPARAMS.TLS, WEBGLSYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
}
else if (runtimeMode === "focused") {
    vosSynchronizer = new VOSSynchronizer(FOCUSEDSYNCHRONIZATIONPARAMS.HOST, FOCUSEDSYNCHRONIZATIONPARAMS.PORT,
        FOCUSEDSYNCHRONIZATIONPARAMS.TLS, FOCUSEDSYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
}
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
    runtimeMode = World.GetQueryParam("RT_MODE");
    if (runtimeMode === "webgl") {
        
    }
    else if (runtimeMode === "focused") {
        
    }
    else {
        Logging.Log("Runtime Mode not set or invalid. Defaulting to webgl.");
        runtimeMode = "webgl";
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
        controlsEntity.SetVisibility(false);
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