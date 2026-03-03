; =================================================How to install==================================================

					; https://www.autohotkey.com/


					; Press Win + R → type:


					; shell:startup


					; Copy your .ahk file into this folder

					; now , it will start automatically at login

; ================================================================================================================



; ================================================= About This File ==============================================
;
;
; This script fixes stuck modifier behavior when triggering Copilot (or any action
; bound to Win + Shift + F23) and converts it into a clean Right Ctrl press.
; It also includes a global suspend toggle with visual feedback.
;
; Usage:
; 1) Master Toggle (` key)
;    - Press the backtick (`) key to suspend/unsuspend the entire script.
;    - Displays a temporary ON/OFF tooltip for 1.5 seconds.
;
; 2) Copilot Fix (*<#+f23)
;    - Intercepts Left Win + Shift + F23 (wildcard enabled).
;    - Force-releases Win and Shift to prevent modifier "leak".
;    - Sends a clean Right Ctrl keypress while F23 is held.
;    - Releases Right Ctrl when F23 is released.
;
;
; Requirements:
; - AutoHotkey v2.0+
;
; Behavior Notes:
; - Uses wildcard (*) so extra modifiers won't block the hotkey.
; - Uses {Blind} to preserve unrelated modifier states.
; - Script runs silently in background after being placed in shell:startup.
;
; ================================================================================================================


#Requires AutoHotkey v2.0

; --- Master Toggle ---
$`:: {
    Suspend(-1)
    ToolTip(A_IsSuspended ? "OFF" : "ON")
    SetTimer(() => ToolTip(), -1500)
}

; --- Copilot Fix ---
; * = Wildcard (handles any extra modifiers)
; <# = Left Win
; + = Shift
*<#+f23:: {
    ; Clean the modifier state so Win/Shift aren't "leaking" into your Ctrl press
    Send("{Blind}{LWin Up}{Shift Up}") 
    
    Send("{RCtrl Down}")
    KeyWait("f23")
    Send("{RCtrl Up}")
}