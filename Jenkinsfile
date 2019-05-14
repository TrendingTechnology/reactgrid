pipeline {
  agent any
  stages {
    // stage('npm') {	
    //   steps {	
    //     bat 'npm install'	
    //   }
    // }

    stage('update files') {
      steps {
        script {
          // powershell 'Remove-Item -Recurse -Force node_modules'
          // if (env.CHANGE_ID) {
          //   fileOperations([fileCopyOperation(	
          //     excludes: "",
          //     flattenFiles: false,	
          //     includes: "**/*",	
          //     targetLocation: "c:/users/lenovo/desktop/dynagrid-for-testing"	
          //   )])
          //   dir(path: 'c:/users/lenovo/desktop/dynagrid-for-testing') {
          //     bat "npm install"
          //   }
          // }
          if (env.BRANCH_NAME == 'test') {
            // fileOperations([fileCopyOperation(	
            //   excludes: "",
            //   flattenFiles: false,	
            //   includes: "**/*",	
            //   targetLocation: "c:/users/lenovo/desktop/dynagrid"	
            // )])
            // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
            //   powershell "git pull origin cleanup"
            // }
          }
        }
      }
    }
    
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
  }

  options {
    disableConcurrentBuilds()
  }

  post {
    success {
      script {
        if (env.BRANCH_NAME == 'test') {
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm whoami"
          // }
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm publish"
          // // }
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm install -g npm-cli-login"
          // }
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm-cli-login -u piotr.mikosza -p Silevis_2019 -e piotr.mikosza@silevis.com"
          // }
          // dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
          //   bat "npm whoami"
          // }
          dir(path: 'c:/users/lenovo/desktop/react-dyna-grid') {
            bat "git pull origin cleanup"
          }
        }
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
