pipeline {
    agent any

    environment {
        IMAGE_NAME = "nodejs-app"
        CONTAINER_NAME = "my-node-container"
        APP_PORT = "3000"
        REPO_URL = "https://github.com/TahirBaltee/NodeJs-App.git"
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh 'rm -rf NodeJs-App || true'  // Remove old repo if exists
                    sh 'git clone ${env.REPO_URL} NodeJs-App'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        cd NodeJs-App && \
                        docker build -t ${env.IMAGE_NAME} .
                    '''
                }
            }
        }

        stage('Stop & Remove Existing Container') {
            steps {
                script {
                    sh '''
                        docker stop ${env.CONTAINER_NAME} || true
                        docker rm -f ${env.CONTAINER_NAME} || true
                    '''
                }
            }
        }

        stage('Run New Container') {
            steps {
                script {
                    sh '''
                        docker run -d --rm -p ${env.APP_PORT}:${env.APP_PORT} --name ${env.CONTAINER_NAME} ${env.IMAGE_NAME}
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
