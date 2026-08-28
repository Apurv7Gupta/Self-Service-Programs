> [!IMPORTANT]
> Last performed on Docker version 29.7.2, build a7dcaa6 **may need to be revisited after Docker Desktop updates**


### How to Force Docker Desktop Installation to a Custom Drive on Windows

Docker Desktop notoriously hardcodes paths to the `C:` drive for heavy assets (WSL virtual disks, container layers, cache). Standard installer flags only move the binaries. This implementation uses native CLI flags for data roots and NTFS Directory Junctions for hardcoded `AppData` paths to force all heavy data off the `C:` drive.

*Note: Docker actively blocks symlinking `C:\ProgramData\DockerDesktop` as an anti-privilege-escalation measure. It must remain on `C:`, but only stores kilobyte-sized logs and global settings.*

#### Prerequisites

1. Download `Docker Desktop Installer.exe`.
2. Create your target folder on the custom drive (e.g., `D:\Docker`).
3. Move the downloaded `Docker Desktop Installer.exe` into that target folder.

#### Execution

1. Open **PowerShell as Administrator**.
2. Run the following script. Modify the `$targetBase` variable in line 1 to match your custom path.

```powershell
# Define target base directory (Modify this to your specific drive/path)
$targetBase = "D:\Docker" 
$installerPath = "$targetBase\Docker Desktop Installer.exe"

# Terminate any existing Docker processes that might lock files
Get-Process -Name "*Docker*" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean up C:\ProgramData\DockerDesktop if it was junctioned previously.
# Docker requires this specific folder to be a real directory on C: for security reasons.
if (Test-Path "$env:PROGRAMDATA\DockerDesktop") { cmd /c rmdir "`"$env:PROGRAMDATA\DockerDesktop`"" }

# Define and provision exact target directories on the custom drive
$targetDirs = @(
    "$targetBase\ProgramFiles",
    "$targetBase\WSL",
    "$targetBase\WindowsContainers",
    "$targetBase\HyperV",
    "$targetBase\AppData_Roaming",
    "$targetBase\AppData_Local",
    "$targetBase\ProgramData_Docker",
    "$targetBase\DotDocker"
)
foreach ($dir in $targetDirs) { New-Item -ItemType Directory -Force -Path $dir -ErrorAction SilentlyContinue | Out-Null }

# Map remaining hardcoded Windows paths to the custom drive targets
$junctions = @{
    "$env:APPDATA\Docker" = "$targetBase\AppData_Roaming"
    "$env:LOCALAPPDATA\Docker" = "$targetBase\AppData_Local"
    "$env:PROGRAMDATA\Docker" = "$targetBase\ProgramData_Docker"
    "$env:USERPROFILE\.docker" = "$targetBase\DotDocker"
}

foreach ($j in $junctions.GetEnumerator()) {
    if (Test-Path $j.Name) { 
        # Strip read-only attributes from all files to prevent Access Denied errors
        Get-ChildItem -Path $j.Name -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object { $_.Attributes = 'Normal' }
        
        # Use cmd rmdir to safely delete directories. PowerShell's Remove-Item can 
        # accidentally recursively delete target files through existing junctions.
        cmd /c rmdir /s /q "`"$($j.Name)`"" 2>$null
    }
    
    # Create NTFS directory junctions to aggressively hijack hardcoded paths
    cmd /c mklink /J "`"$($j.Name)`"" "`"$($j.Value)`""
}

# Run installer silently with explicit flags for all backend data roots
$installArgs = "install --quiet --accept-license --installation-dir=`"$targetBase\ProgramFiles`" --wsl-default-data-root=`"$targetBase\WSL`" --windows-containers-default-data-root=`"$targetBase\WindowsContainers`" --hyper-v-default-data-root=`"$targetBase\HyperV`""

Start-Process -Wait -FilePath $installerPath -ArgumentList $installArgs

```
Docker Desktop is now installed

Install WSL (this will be in C: with limited space and won't grow):

```powershell
wsl --install
```

- if the ubuntu installation fails:
  ```
  Downloading: Ubuntu

  The connection with the server was reset ================ ]

  Error code: Wsl/InstallDistro/0x80072eff 
  ```

  Bypass the fragile command-line downloader and use the Microsoft Store, which natively handles connection drops and resumes:

    - Open the Microsoft Store app from your Start Menu.

    - Search for Ubuntu (the standard version without a year/version number).

    - Click Get or Install.

    - Once the download finishes, launch Ubuntu from the Start Menu.
      
    - A terminal will open and perform a brief initial setup. Enter a new UNIX username and password when prompted.

    - Close the Ubuntu terminal and launch Docker Desktop.

      ```ubuntu
      Installing, this may take a few minutes...
      Please create a default UNIX user account. The username does not need to match your Windows username.
      For more information visit: https://aka.ms/wslusers
      Enter new UNIX username: ubuntu
      New password:
      Retype new password:
      passwd: password updated successfully
      Installation successful!
      To run a command as administrator (user "root"), use "sudo <command>".
      See "man sudo_root" for details.

      ubuntu@DeusExMachina:~$
      ```
