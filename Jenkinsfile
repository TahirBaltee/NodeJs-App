pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
    }

    stages {
        stage('Check Prerequisites') {
            steps {
                script {
                    // Ensure Git and Docker are installed
                    sh '''
                        if ! command -v git &> /dev/null; then 
                            echo "Git not found. Installing..."; 
                            sudo apt update && sudo apt install -y git; 
                        fi

                        if ! command -v docker &> /dev/null; then 
                            echo "Docker not found!"; exit 1; 
                        fi
                    '''
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    sh '''
                        # Use BASH to avoid bad substitution error
                        echo "Cloning repository..."
                        rm -rf NodeJs-App || true
                        git clone '${REPO_URL}' NodeJs-App
                    ''' 
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        # Ensure we use bash
                        echo "Building Docker Image..."
                        cd NodeJs-App
                        docker build -t '${IMAGE_NAME}' .
                    ''' 
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        # Ensure we use bash
                        if docker ps -a --format '{{.Names}}' | grep -w '${CONTAINER_NAME}'; then
                            echo "Stopping and Removing Existing Container..."
                            docker stop '${CONTAINER_NAME}' || true
                            docker rm '${CONTAINER_NAME}' || true
                        else
                            echo "No existing container found. Skipping..."
                        fi
                    ''' 
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh '''
                        # Ensure we use bash
                        echo "Running New Container..."
                        docker run -d -p '${APP_PORT}':'${APP_PORT}' --name '${CONTAINER_NAME}' '${IMAGE_NAME}'
                    ''' 
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
