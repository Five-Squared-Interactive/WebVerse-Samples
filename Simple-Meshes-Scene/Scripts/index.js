const SYNCHRONIZATIONPARAMS = {
    HOST: "127.0.0.1",
    PORT: 5525,
    TLS: false,
    TRANSPORT: "tcp"
};

const SESSIONINFO = {
    id: "ba8e3de0-4a5d-4ca8-9841-ae78fb12e0a4",
    tag: "test"
};

let characterSynchronized = false;
let characterLoaded = false;
let sessionJoined = false;

let vosSynchronizer = new VOSSynchronizer(SYNCHRONIZATIONPARAMS.HOST, SYNCHRONIZATIONPARAMS.PORT,
    SYNCHRONIZATIONPARAMS.TLS, SYNCHRONIZATIONPARAMS.TRANSPORT, SESSIONINFO, OnConnect, OnJoinSession);
let thirdPersonCharacter = new ThirdPersonCharacter("New User", null, -90, 90, 0.1, 0.1, OnCharacterLoaded);
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

function OnConnect() {
    
}

function OnJoinSession() {
    sessionJoined = true;
}

function OnCharacterLoaded() {
    characterLoaded = true;
}