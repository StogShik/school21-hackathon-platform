const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

console.log('Testing file access in uploads directory:');
console.log('Directory path:', uploadsDir);

if (fs.existsSync(uploadsDir)) {
    console.log('✅ Uploads directory exists');
    
    try {
        const files = fs.readdirSync(uploadsDir);
        console.log(`Found ${files.length} files in directory:`);
        
        files.forEach((file, index) => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            console.log(`${index+1}. ${file} - ${stats.size} bytes`);
            
            try {
                const fd = fs.openSync(filePath, 'r');
                fs.closeSync(fd);
                console.log(`   ✅ File can be opened for reading`);
            } catch (err) {
                console.log(`   ❌ Cannot open file for reading: ${err.message}`);
            }
        });
    } catch (err) {
        console.error('❌ Error reading directory:', err);
    }
} else {
    console.error('❌ Uploads directory does not exist!');
}

try {
    const testFilePath = path.join(uploadsDir, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file to verify write access');
    console.log('✅ Successfully created test file');
    
    fs.unlinkSync(testFilePath);
    console.log('✅ Successfully deleted test file');
} catch (err) {
    console.error('❌ Error with file write/delete test:', err);
}

console.log('File access test complete.');
