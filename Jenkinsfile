pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
        CREDENTIALS_ID = "Node-pipeline"
        COMPOSE_FILE = "docker-compose.yml"  // Ensure correct Docker Compose file
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
                        docker-compose -f ${COMPOSE_FILE} build
                    '''
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        echo "Stopping and Removing Existing Container..."
                        docker-compose -f ${COMPOSE_FILE} down || true
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh '''
                        echo "Running New Container using Docker Compose..."
                        docker-compose -f ${COMPOSE_FILE} up -d
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
