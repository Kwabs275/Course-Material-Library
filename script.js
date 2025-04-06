document.addEventListener('DOMContentLoaded', () => {
    const levelSelect = document.getElementById('level');
    const schoolSelect = document.getElementById('school');
    const programSelect = document.getElementById('program');
    const resultsContainer = document.getElementById('results-container');

    // --- Placeholder Data Structure ---
    // Using descriptive names that match the visual example (gemiiei.png)
    const placeholderLevelData = {
        'Course 1 Name': { // Changed from 'Placeholder Course 1'
            description: 'Add Course 1 Description Here', // Changed placeholder text
            files: [
                // Changed title and filename placeholders
                { title: 'Add File 1', filename: 'path/to/course1_file1.[ext]' },
                { title: 'Add File 2', filename: 'path/to/course1_file2.[ext]' }
            ]
        },
        'Course 2 Name': { // Changed from 'Placeholder Course 2'
            description: 'Add Course 2 Description Here', // Changed placeholder text
            files: [
                 // Changed title and filename placeholders
                { title: 'Add File 1', filename: 'path/to/course2_file1.[ext]' }
            ]
        }
    };

    // --- School of Study Options and Programs ---
    let schools = {
        'School of Engineering': {
            'BSc. Computer Engineering': {
                'Level 100': {},
                // L200 Comp Eng now uses the *new* descriptive placeholders
                'Level 200': JSON.parse(JSON.stringify(placeholderLevelData)),
                'Level 300': {},
                'Level 400': {},
            },
            'BSc. Petroleum Engineering': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Civil Engineering': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Mechanical Engineering': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Electrical and Electronic Engineering': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Agricultural Engineering': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
        },
        'School of Natural Resources': {
            'BSc. Fire Safety and Disaster Management': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Hospitality Management': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Natural Resources Management': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
        },
        'School of Sciences': {
            'BSc. Chemistry': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Biology Science': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Information Technology': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Mathematics': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Actuarial Science': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Statistics': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
        },
        'School of Arts and Social Sciences': {
            'BSc. Resource Enterprise and Entrepreneurship': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
            'BSc. Economics': { 'Level 100': {}, 'Level 200': {}, 'Level 300': {}, 'Level 400': {} },
        }
    };

    // --- Populate Empty Levels with Placeholder Data ---
    const levelsToPopulate = ['Level 100', 'Level 200', 'Level 300', 'Level 400'];
    for (const schoolName in schools) {
        const schoolData = schools[schoolName];
        for (const programName in schoolData) {
            const programData = schoolData[programName];
            levelsToPopulate.forEach(levelName => {
                // Check if the level exists for the program
                if (programData.hasOwnProperty(levelName)) {
                    // If the level data is currently an empty object, fill it
                    if (Object.keys(programData[levelName]).length === 0) {
                        programData[levelName] = JSON.parse(JSON.stringify(placeholderLevelData));
                    }
                } else {
                    // If the level key doesn't even exist, add it with placeholder data
                    programData[levelName] = JSON.parse(JSON.stringify(placeholderLevelData));
                }
            });
        }
    }


    // --- Setup for index.html ---
    // (This part remains unchanged)
    if (levelSelect) {
        const levels = ['Level 100', 'Level 200', 'Level 300', 'Level 400'];
        levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.text = level;
            levelSelect.appendChild(option);
        });
    }

    if (schoolSelect) {
        for (const school in schools) {
            const option = document.createElement('option');
            option.value = school;
            option.text = school;
            schoolSelect.appendChild(option);
        }

        schoolSelect.addEventListener('change', () => {
            if (programSelect) {
                const selectedSchool = schoolSelect.value;
                programSelect.innerHTML = '<option value="" disabled selected>Select Program</option>';
                if (schools.hasOwnProperty(selectedSchool)) {
                    for (const program in schools[selectedSchool]) {
                        const option = document.createElement('option');
                        option.value = program;
                        option.text = program;
                        programSelect.appendChild(option);
                    }
                }
            }
        });
    }

    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const selectedLevel = levelSelect ? levelSelect.value : null;
            const selectedProgram = programSelect ? programSelect.value : null;
            const selectedSchool = schoolSelect ? schoolSelect.value : null;

            if (selectedLevel && selectedProgram && selectedSchool) {
                localStorage.setItem('selectedLevel', selectedLevel);
                localStorage.setItem('selectedProgram', selectedProgram);
                localStorage.setItem('selectedSchool', selectedSchool);
                localStorage.setItem('schoolsData', JSON.stringify(schools));
                window.location.href = 'results.html';
            } else {
                alert("Please select Level, School, and Program before searching.");
            }
        });
    }

    // --- Setup for results.html ---
    // (This part remains unchanged)
    if (resultsContainer) {
        try {
            const schoolsDataString = localStorage.getItem('schoolsData');
            const storedLevel = localStorage.getItem('selectedLevel');
            const storedProgram = localStorage.getItem('selectedProgram');
            const storedSchool = localStorage.getItem('selectedSchool');

            resultsContainer.innerHTML = ""; // Clear loading/previous results

            if (!schoolsDataString || !storedLevel || !storedProgram || !storedSchool) {
                 resultsContainer.textContent = "Selection data missing. Please go back and make a selection.";
                 return;
            }

            const schoolsData = JSON.parse(schoolsDataString);

            let filteredMaterials = {};
            if (schoolsData &&
                schoolsData.hasOwnProperty(storedSchool) &&
                schoolsData[storedSchool].hasOwnProperty(storedProgram) &&
                schoolsData[storedSchool][storedProgram].hasOwnProperty(storedLevel))
             {
                 filteredMaterials = schoolsData[storedSchool][storedProgram][storedLevel];
            }

            // Display the filtered materials
            if (Object.keys(filteredMaterials).length > 0) {
                for (const courseName in filteredMaterials) {
                    if (filteredMaterials.hasOwnProperty(courseName)) {
                        const courseData = filteredMaterials[courseName];
                        const courseDiv = document.createElement('div');
                        courseDiv.classList.add('course-container');

                        const courseTitle = document.createElement('h3');
                        courseTitle.textContent = courseName; // This will now display "Course 1 Name", etc.
                        courseDiv.appendChild(courseTitle);

                        if (courseData.description) {
                            const courseDescription = document.createElement('p');
                            courseDescription.classList.add('course-description');
                            courseDescription.textContent = courseData.description; // Displays "[Add Course...]"
                            courseDiv.appendChild(courseDescription);
                        }

                        const filesList = document.createElement('ul');
                        if (courseData.files && courseData.files.length > 0) {
                            courseData.files.forEach(materialFile => {
                                const fileItem = document.createElement('li');
                                const link = document.createElement('a');
                                // Use the placeholder filename for href initially
                                link.href = '#'; // Set href to '#' for placeholder links initially
                                // Or keep: link.href = materialFile.filename;
                                link.textContent = materialFile.title; // Displays "File 1", "File 2"
                                // Keep download attribute pointing to intended filename structure
                                link.download = materialFile.filename;
                                fileItem.appendChild(link);
                                filesList.appendChild(fileItem);
                            });
                        } else {
                            const noFilesMessage = document.createElement('li');
                            noFilesMessage.textContent = "No files listed for this course."; // Adjusted message
                            filesList.appendChild(noFilesMessage);
                        }
                        courseDiv.appendChild(filesList);
                        resultsContainer.appendChild(courseDiv);
                    }
                }
            } else {
                 // This case should be less likely now unless a level somehow becomes empty again
                resultsContainer.textContent = "No materials structure found for this selection.";
            }

        } catch (error) {
            console.error("Error loading or displaying course materials:", error);
            resultsContainer.innerHTML = "<p>An error occurred while loading course materials. Please check the console for details and try again later.</p>";
        }
    }
});