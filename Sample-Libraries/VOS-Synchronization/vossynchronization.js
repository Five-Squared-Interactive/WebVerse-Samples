/// @file vossynchronization.js
/// Module for a VOS synchronizer.

class VOSSynchronizer {
    constructor(host, port, tls = false, transport = "tcp", sessionToConnectTo = null, onConnect = null, onJoinedSession = null) {
        this.host = host;
        this.port = port;
        this.tls = tls;
        this.transport = transport;
        this.sessionToConnectTo = sessionToConnectTo;
        this.onJoinedSession = onJoinedSession;
        
        this.OnConnected = function() {
            if (onConnect != null) {
                OnConnect();
            }
        }
        
        Context.DefineContext("VOSSynchronizationContext", this);
    }
    
    Connect() {
        var onJoinedAction =
        `
            context = Context.GetContext("VOSSynchronizationContext");
            Logging.Log('[VOSSynchronization:Connect] Joined Session');
            if (context.onJoinedSession != null) {
                context.onJoinedSession();
            }
        `;
        
        var onConnectedAction =
        `
            context = Context.GetContext("VOSSynchronizationContext");
            if (context.OnConnected != null) {
                context.OnConnected();
            }
            
            if (context.sessionToConnectTo != null) {
                VOSSynchronization.JoinSession(context.host, context.port, context.sessionToConnectTo.id,
                    context.sessionToConnectTo.tag, ` + "`" + onJoinedAction + "`" + `
                    );
            }
        `;
        
        var result = VOSSynchronization.ConnectToService(this.host, this.port, this.tls, onConnectedAction);
    }
    
    Disconnect() {
        VOSSynchronization.DisconnectService(this.host, this.port);
    }
    
    AddEntity(entityID, deleteWithClient = false, resources = null) {
        VOSSynchronization.StartSynchronizingEntity(this.host, this.port, entityID, deleteWithClient, resources);
    }
}