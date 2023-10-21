import { watch } from 'chokidar';
import { exec } from 'child_process';
import process from 'process';
import c from './color.js';
import yargs from 'yargs';
import { hideBin } from "yargs/helpers";
const argv = yargs(hideBin(process.argv))
    .option('ignoreDirs', {
        alias: 'd',
        describe: 'Comma-separated list of directories to ignore',
        type: 'string',
    })
    .option('ignoreFiles', {
        alias: 'f',
        describe: 'Comma-separated list of files to ignore',
        type: 'string',
    })
    .option('run', {
        alias: 'r',
        describe: 'Bash script to execute',
        type: 'string',
    })
    .help('help')
    .alias('help', 'h')
    .example("node yourScript.js --ignoreDirs=dir1,dir2 --ignoreFiles=file1.txt,file2.txt --run=myscript.sh")
    .parse()


const currentDirectory = process.cwd();
console.log(`watching  directory: ${currentDirectory}`);
const filesToWatch = "./";
const bashScript = argv.run;
console.log({argv})
const ignoredDirs = argv.ignoreDirs?argv.ignoreDirs.split(','):[]
const ignoredFiles =argv.ignoreFiles?argv.ignoreFiles.split(','):[]
console.log({ ignoredDirs, ignoredFiles, bashScript })


const watcher = watch(filesToWatch, {
    ignored: [...ignoredDirs, ...ignoredFiles],
});

//console.log(`Watching files: ${filesToWatch.join(', ')}`);
function clear() {
    process.stdout.write('\x1Bc');
}
function runScript() {
    if (!bashScript) {
        console.log(`${c.red} run script missing!`)
        return
    }
    exec(` bash ${bashScript}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing the bash script: ${error}`);
        }
        console.log(stdout);
    });
}
runScript()
// Set up the event listener for file changes
watcher.on('change', (filePath) => {
    clear()
    console.log(`${c.green}reload due to : ${c.yellow}${filePath}  ${c.green}change${c.reset}`);
    console.log(`${c.blue}` + '-'.repeat(25) + 'output' + '-'.repeat(25) + `${c.reset}`)
    runScript()
});

// Handle errors and other events if needed 
watcher.on('error', (error) => {
    console.error(`Watcher error: ${error}`);
});
