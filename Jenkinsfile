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
                    // Remove 'sudo' and check if Git & Docker are installed
                    sh '''
                        echo "Checking prerequisites..."

                        if ! command -v git &> /dev/null; then 
                            echo "❌ Git is not installed. Please install it manually."
                            exit 1
                        else
                            echo "✅ Git is installed."
                        fi

                        if ! command -v docker &> /dev/null; then 
                            echo "❌ Docker is not installed. Please install Docker and restart Jenkins."
                            exit 1
                        else
                            echo "✅ Docker is installed."
                        fi
                    '''
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    sh '''
                        echo "Cloning repository..."
                        rm -rf NodeJs-App || true
                        git clone ${REPO_URL} NodeJs-App
                    ''' 
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "Building Docker Image..."
                        cd NodeJs-App
                        docker build -t ${IMAGE_NAME} .
                    ''' 
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        if docker ps -a --format '{{.Names}}' | grep -w ${CONTAINER_NAME}; then
                            echo "Stopping and Removing Existing Container..."
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
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
                        echo "Running New Container..."
                        docker run -d -p ${APP_PORT}:${APP_PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}
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
