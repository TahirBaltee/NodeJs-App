pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
        CREDENTIALS_ID = "Node-pipeline"
        COMPOSE_FILE = "docker-compose.yml"  
    }

    stages {
        stage('Check Prerequisites') {
            steps {
                script {
                    sh '''
                        echo "🔎 Checking prerequisites..."
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
                    withCredentials([usernamePassword(credentialsId: env.CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                            echo "🛠 Configuring Git authentication..."
                            git config --global user.email "tahirsalingi@gmail.com"
                            git config --global user.name "TahirBaltee"
                            git config --global credential.helper store
                            echo "https://${GIT_USER}:${GIT_PASS}@github.com" > ~/.git-credentials
                            chmod 600 ~/.git-credentials
                            echo "📥 Cloning repository from GitHub..."
                            rm -rf NodeJs-App || true
                            git clone ${REPO_URL} NodeJs-App
                            cd NodeJs-App
                        '''
                    }
                }
            }
        }

        stage('Pull Latest Images') {
            steps {
                script {
                    sh '''
                        echo "🔄 Pulling latest Docker images..."
                        docker-compose -f ${COMPOSE_FILE} pull || true
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        echo "🚀 Building Docker Image using Docker Compose..."
                        cd NodeJs-App
                        docker-compose -f ${COMPOSE_FILE} build
                    '''
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        echo "🛑 Stopping and Removing Existing Container..."
                        cd NodeJs-App
                        docker-compose -f ${COMPOSE_FILE} down || true
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh '''
                        echo "🚀 Running New Container using Docker Compose..."
                        cd NodeJs-App
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
