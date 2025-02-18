pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
        CREDENTIALS_ID = "Node-pipeline"
    }

    stages {
        stage('Check Prerequisites') {
            steps {
                script {
                    sh '''
                        echo "Checking prerequisites..."
                        if command -v git >/dev/null 2>&1; then echo "✅ Git is installed."; else echo "❌ Git is not installed."; exit 1; fi
                        if command -v docker >/dev/null 2>&1; then echo "✅ Docker is installed."; else echo "❌ Docker is not installed."; exit 1; fi
                        if command -v docker-compose >/dev/null 2>&1; then echo "✅ Docker Compose is installed."; else echo "❌ Docker Compose is not installed."; exit 1; fi
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
                        userRemoteConfigs: [[url: env.REPO_URL, credentialsId: env.CREDENTIALS_ID]]
                    ])
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "Building Docker Image using Docker Compose..."
                        docker-compose build
                    '''
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        if docker ps -a --format '{{.Names}}' | grep -w my-node-container; then
                            echo "Stopping and Removing Existing Container..."
                            docker-compose down
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
                        echo "Running New Container using Docker Compose..."
                        docker-compose up -d
                    '''
                }
            }
        }
    }

    post {
        success { echo "✅ Deployment Successful!" }
        failure { echo "❌ Deployment Failed!" }
    }
}
