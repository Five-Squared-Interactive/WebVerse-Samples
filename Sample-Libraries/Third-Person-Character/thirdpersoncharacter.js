/// @file thirdpersoncharacter.js
/// Module for a third person character.

class ThirdPersonCharacter {
    constructor(name, id = null, minZ = -90, maxZ = 90, motionMultiplier = 0.1, rotationMultiplier = 0.1, onLoaded = null) {
        this.minZ = minZ;
        this.maxZ = maxZ;
        this.motionMultiplier = motionMultiplier
        this.rotationMultiplier = rotationMultiplier;
        
        this.currentMotion = Vector3.zero;
        this.currentRotation = Vector3.zero;
        this.currentTransform = null;
        this.characterEntity = null;
        
        this.characterEntityID = null;
        if (id != null)
        {
            this.characterEntityID = id;
        }
        else
        {
            this.characterEntityID = UUID.NewUUID().ToString();
        }
        
        this.OnLoaded = function() {
            if (onLoaded != null) {
                onLoaded();
            }
        }
        
        /// @function ThirdPersonCharacter.Update
        /// Perform a single update on the character.
        this.CharacterUpdate = function() {
            context = Context.GetContext("thirdPersonCharacterContext");
            if (context.characterEntity != null) {
                context.currentTransform = context.characterEntity.GetTransform();
                var newMotion = new Vector3(context.currentTransform.forward.x * context.currentMotion.x - context.currentTransform.right.x * context.currentMotion.z,
                    0, context.currentTransform.forward.z * context.currentMotion.x - context.currentTransform.right.z * context.currentMotion.z);
                var newPosition = new Vector3(context.currentTransform.position.x + newMotion.x,
                    context.currentTransform.position.y, context.currentTransform.position.z + newMotion.z);
                context.characterEntity.SetPosition(newPosition, false);
                var entityRotation = new Vector3(context.currentRotation.x, context.currentRotation.y, 0);
                var cameraRotation = new Vector3(context.currentRotation.z, -90, 0);
                context.characterEntity.SetEulerRotation(entityRotation, false);
                Camera.SetEulerRotation(cameraRotation, true);
            }
        }
        
        var onLoadedAction =
        `
            var context = Context.GetContext("thirdPersonCharacterContext");
            context.OnLoaded();
        `;
        
        Context.DefineContext("thirdPersonCharacterContext", this);
        
        this.characterEntity = CharacterEntity.Create(null, Vector3.zero,
            Quaternion.identity, Vector3.one, false, name, this.characterEntityID, onLoadedAction);
        this.characterEntity.PlaceCameraOn();
        Camera.SetPosition(new Vector3(2, 2, 0), true);
        this.characterEntity.SetVisibility(true);
        
        Time.SetInterval(`
            var context = Context.GetContext("thirdPersonCharacterContext");
            if (context == null) {
                Logging.LogError("[ThirdPersonCharacter] Unable to get context.");
            }
            else {
                context.CharacterUpdate();
            }`,
            0.005);
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.MoveCharacter
    /// Move the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the motion.
    /// @param {float} y The Y component of the motion.
    MoveCharacter(x, y) {
        this.currentMotion.x = x * this.motionMultiplier;
        this.currentMotion.z = y * this.motionMultiplier;
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.EndMoveCharacter
    /// End the motion for the character.
    EndMoveCharacter() {
        this.currentMotion = Vector3.zero;
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.LookCharacter
    /// Perform a look on the character by the provided amounts in the x and y directions.
    /// @param {float} x The X component of the look.
    /// @param {float} y The Y component of the look.
    LookCharacter(x, y) {
        this.currentRotation.y += x * this.rotationMultiplier;
        this.currentRotation.z -= y * this.rotationMultiplier;
        if (this.currentRotation.z > this.maxZ) {
            this.currentRotation.z = this.maxZ;
        }
        if (this.currentRotation.z < this.minZ) {
            this.currentRotation.z = this.minZ;
        }
        Context.DefineContext("thirdPersonCharacterContext", this);
    }
    
    /// @function ThirdPersonCharacter.EndLookCharacter
    /// End the look for the character.
    EndLookCharacter() {
        
    }
}