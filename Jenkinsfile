pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code...'
                checkout scm
            }
        }

        stage('Build Services') {
            steps {
                echo 'Building Docker services...'
                sh 'docker-compose -f $DOCKER_COMPOSE_FILE build'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                // Run backend tests
                sh 'docker-compose -f $DOCKER_COMPOSE_FILE run --rm backend npm test'
                // Run frontend tests
                sh 'docker-compose -f $DOCKER_COMPOSE_FILE run --rm frontend npm run test'
            }
        }

        stage('Deploy Services') {
            steps {
                echo 'Deploying Docker services...'
                sh 'docker-compose -f $DOCKER_COMPOSE_FILE up -d'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up dangling Docker resources...'
            sh 'docker system prune --volumes --force --all'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}