pipeline {
  agent any
  stages {
    // stage('npm') {	
    //   steps {	
    //     bat 'npm ci'	
    //   }
    // }

    // stage('update files') {
    //   steps {
    //     script {
    //       powershell 'Remove-Item -Recurse -Force node_modules'
    //       if (env.CHANGE_ID) {
    //         fileOperations([fileCopyOperation(	
    //           excludes: "",
    //           flattenFiles: false,	
    //           includes: "**/*",	
    //           targetLocation: "c:/users/lenovo/desktop/dynagrid-for-testing"	
    //         )])
    //         dir(path: 'c:/users/lenovo/desktop/dynagrid-for-testing') {
    //           bat "npm ci"
    //         }
    //       }
    //       if (env.BRANCH_NAME == 'develop') {
    //         fileOperations([fileCopyOperation(	
    //           excludes: "",
    //           flattenFiles: false,	
    //           includes: "**/*",	
    //           targetLocation: "c:/users/lenovo/desktop/dynagrid"	
    //         )])
    //         dir(path: 'c:/users/lenovo/desktop/dynagrid') {
    //           bat "npm ci"
    //         }
    //       }
    //     }
    //   }
    // }
    
    // stage('tests') {
    //   steps {
    //     script {
    //       if (env.CHANGE_ID) { // if pipeline is triggered by pull request
    //         dir(path: 'c:/users/lenovo/desktop/dynagrid-for-testing') {
    //           bat "npm run test:automatic"
    //         }
    //       }
    //     }
    //   }
    // }
    stage('test') {
      steps {
        bat "echo hello world"
      }
    }
  }

  options {
    disableConcurrentBuilds()
  }

  post {
    success {
      script {
        // if (env.BRANCH_NAME == 'develop') {
          dir(path: 'c:/users/lenovo/desktop/dynagrid') {
              bat "npm version patch && npm publish"
          }
          // load "$JENKINS_HOME/jobvars.env"
          // withEnv(["TOKEN=${NPMJS_TOKEN}"]) {
          //   bat "npm login"
          // }
        // }
       }  
    }

    cleanup {
      /* clean up our workspace */
      deleteDir()
      dir("${workspace}@tmp") {
        deleteDir()
      }
      dir("${workspace}@script") {
        deleteDir()
      }
      dir("${workspace}@script@tmp") {
        deleteDir()
      }
    }

    failure {
      emailext(to: 'piotr.mikosza@silevis.com', subject: "${env.JOB_NAME} ended with failure!", body: "Somethin was wrong! \n\nConsole: ${env.BUILD_URL}.\n\n")
    }
  }

  tools {
    nodejs 'node-v10.15.3'
  }
}