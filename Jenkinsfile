pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying..'
                withCredentials([
                    usernamePassword(credentialsId: '58862aae-835a-4432-afcb-77cacde5486e', usernameVariable: 'NPM_USER', passwordVariable: 'NPM_PASS'),
                    string(credentialsId: '42ee0f7f-ea19-4adf-9135-3bbb64e0e76b', variable: 'NPM_EMAIL')
                    ]) {
                    sh 'npm-cli-login'
                }
                
				sh 'npm publish dist'
            }
        }
    }
}