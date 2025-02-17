pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
        CREDENTIALS_ID = "Node-pipeline" // Make sure this matches your Jenkins credentials ID
    }

    stages {
        stage('Check Prerequisites') {
            steps {
                script {
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
                    echo "Cloning repository from GitHub..."
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: env.REPO_URL,
                            credentialsId: env.CREDENTIALS_ID
                        ]]
                    ])
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "Building Docker Image..."
                        docker build -t ${env.IMAGE_NAME} .
                    ''' 
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        if docker ps -a --format '{{.Names}}' | grep -w ${env.CONTAINER_NAME}; then
                            echo "Stopping and Removing Existing Container..."
                            docker stop ${env.CONTAINER_NAME} || true
                            docker rm ${env.CONTAINER_NAME} || true
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
                        docker run -d -p ${env.APP_PORT}:${env.APP_PORT} --name ${env.CONTAINER_NAME} ${env.IMAGE_NAME}
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
