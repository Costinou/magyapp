# magyapp

Learn vocabulary


First exec on my raspy
```bash

#!/bin/bash

# Function to check and install a package if it's not already installed
install_if_not_installed() {
    if ! dpkg -l | grep -q "^ii  $1 "; then
        echo "Installing $1..."
        sudo apt update && sudo apt install -y "$1"
    else
        echo "$1 is already installed."
    fi
}

# Install vim, git, and docker if needed
install_if_not_installed vim
install_if_not_installed git
install_if_not_installed docker.io
install_if_not_installed docker-compose

# Ensure Docker is running
if ! systemctl is-active --quiet docker; then
    echo "Starting Docker..."
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# Download the latest tag of magyapp and place it in /opt/magyapp
echo "Downloading the magyapp repository..."
sudo mkdir -p /opt/magyapp
sudo chown "$USER":"$USER" /opt/magyapp # Set ownership to current user for cloning

cd /opt/magyapp || exit

# Remove old version if it exists
if [ -d "magyapp" ]; then
    echo "Removing the old version of magyapp..."
    sudo rm -rf magyapp
fi

# Clone the repository and checkout the latest tag
git clone https://github.com/Costinou/magyapp.git
cd magyapp || exit
latest_tag=$(git describe --tags `git rev-list --tags --max-count=1`)
git checkout "$latest_tag"

# Set ownership back to root for security
sudo chown -R root:root /opt/magyapp

echo "Setup complete. The magyapp repository is located in /opt/magyapp with the latest tag ($latest_tag)."

sudo docker-compose up --build
```
 