pipeline {
    agent any

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm install"
            }
        }

        stage("Run Automated Tests") {
            steps {
                sh "npm test"
            }
        }

        stage("Asset Verification") {
            steps {
                sh "test -f dashboard.html && echo \"Assets verified successfully\""
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}