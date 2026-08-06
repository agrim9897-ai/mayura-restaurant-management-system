document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileMenu.classList.remove('translate-x-full');
        // Stagger load links
        mobileLinks.forEach((link, idx) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            link.style.transition = `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`;
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100);
        });
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('translate-x-full');
    }

    if (mobileMenuBtn && mobileMenuCloseBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    }

    // --- 2. Scroll Progress Bar & Indicator Fade & Navbar Scroll Effect ---
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Progress Bar
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }

        // Fade out scroll down indicator
        if (scrollIndicator) {
            if (scrollTop > 80) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '0.7';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }

        // Navbar style change on scroll
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('nav-scrolled');
                navbar.classList.remove('py-6');
                navbar.classList.add('py-4');
            } else {
                navbar.classList.remove('nav-scrolled');
                navbar.classList.add('py-6');
                navbar.classList.remove('py-4');
            }
        }
    });

    // --- 3. Scroll Reveal System ---
    const revealElements = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.08
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animation
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Parallax Background ---
    const parallaxBg = document.getElementById('parallax-bg');
    const whyChooseParallax = document.getElementById('why-choose-parallax-container');
    const reserveParallax = document.getElementById('reserve-parallax-container');
    
    function handleParallax(el, speed) {
        if (!el) return;
        const scrolled = window.scrollY;
        const section = el.closest('section');
        const limit = section ? section.offsetTop : el.parentElement.offsetTop;
        const parentHeight = section ? section.offsetHeight : el.parentElement.offsetHeight;
        if (scrolled >= limit - window.innerHeight && scrolled <= limit + parentHeight) {
            const yPos = -((scrolled - limit) * speed);
            el.style.transform = `translateY(${yPos}px)`;
        }
    }

    window.addEventListener('scroll', () => {
        handleParallax(parallaxBg, 0.15);
        handleParallax(whyChooseParallax, 0.08);
        handleParallax(reserveParallax, 0.08);
    });

    // --- 5. Custom Date & Time Picker Controls ---
    const dateInput = document.getElementById('reserve_date');
    const calendarPopup = document.getElementById('custom-calendar-popup');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    const timeInput = document.getElementById('reserve_time');
    const timePopup = document.getElementById('custom-time-popup');
    const timeSlotsContainer = document.getElementById('time-slots-container');

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDate = null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Date picker toggle
    if (dateInput && calendarPopup) {
        dateInput.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDropdowns();
            calendarPopup.classList.remove('hidden');
            calendarPopup.offsetHeight; // force reflow
            calendarPopup.classList.add('open');
            renderCalendar();
        });
    }

    // Time picker toggle
    if (timeInput && timePopup) {
        timeInput.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDropdowns();
            timePopup.classList.remove('hidden');
            timePopup.offsetHeight; // force reflow
            timePopup.classList.add('open');
            renderTimeSlots();
        });
    }

    function closeDropdowns() {
        if (calendarPopup) {
            calendarPopup.classList.remove('open');
            setTimeout(() => {
                if (!calendarPopup.classList.contains('open')) calendarPopup.classList.add('hidden');
            }, 200);
        }
        if (timePopup) {
            timePopup.classList.remove('open');
            setTimeout(() => {
                if (!timePopup.classList.contains('open')) timePopup.classList.add('hidden');
            }, 200);
        }
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (dateInput && !dateInput.contains(e.target) && calendarPopup && !calendarPopup.contains(e.target)) {
            calendarPopup.classList.remove('open');
            setTimeout(() => {
                if (!calendarPopup.classList.contains('open')) calendarPopup.classList.add('hidden');
            }, 200);
        }
        if (timeInput && !timeInput.contains(e.target) && timePopup && !timePopup.contains(e.target)) {
            timePopup.classList.remove('open');
            setTimeout(() => {
                if (!timePopup.classList.contains('open')) timePopup.classList.add('hidden');
            }, 200);
        }
    });

    // Calendar render
    function renderCalendar() {
        if (!calendarDays || !monthYearDisplay) return;
        calendarDays.innerHTML = "";
        monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Previous month padding days
        for (let x = firstDayIndex; x > 0; x--) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("text-on-surface-variant/20", "py-2");
            dayDiv.textContent = prevLastDate - x + 1;
            calendarDays.appendChild(dayDiv);
        }

        // Active month days
        for (let i = 1; i <= lastDate; i++) {
            const dayDiv = document.createElement("div");
            const thisDate = new Date(currentYear, currentMonth, i);
            dayDiv.textContent = i;
            dayDiv.classList.add("py-2", "rounded-full", "cursor-pointer", "transition-all", "duration-200");

            if (thisDate < today) {
                // Disable past dates
                dayDiv.classList.add("text-on-surface-variant/30", "pointer-events-none");
            } else {
                dayDiv.classList.add("hover:bg-primary/20", "hover:text-primary");
                
                // Active selection state
                if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
                    dayDiv.classList.add("bg-primary", "text-on-primary", "font-bold");
                } else if (thisDate.getTime() === today.getTime()) {
                    dayDiv.classList.add("border", "border-primary/50", "text-primary");
                }

                dayDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedDate = thisDate;
                    const dayString = String(i).padStart(2, '0');
                    const monthString = String(currentMonth + 1).padStart(2, '0');
                    dateInput.value = `${currentYear}-${monthString}-${dayString}`;
                    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                    closeDropdowns();
                });
            }
            calendarDays.appendChild(dayDiv);
        }
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }

    // Time slot rendering
    const availableSlots = [
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM",
        "09:30 PM", "10:00 PM", "10:30 PM"
    ];

    function renderTimeSlots() {
        if (!timeSlotsContainer) return;
        timeSlotsContainer.innerHTML = "";

        availableSlots.forEach(time => {
            const slot = document.createElement("div");
            slot.textContent = time;
            slot.classList.add(
                "py-2.5", "border", "border-outline-variant", "rounded-12",
                "text-xs", "text-on-surface-variant", "cursor-pointer", "transition-all", "duration-200",
                "hover:border-primary", "hover:text-primary", "hover:bg-primary/5"
            );

            if (timeInput.value === time) {
                slot.classList.add("border-primary", "text-primary", "bg-primary/10");
            }

            slot.addEventListener('click', (e) => {
                e.stopPropagation();
                timeInput.value = time;
                timeInput.dispatchEvent(new Event('input', { bubbles: true }));
                closeDropdowns();
            });

            timeSlotsContainer.appendChild(slot);
        });
    }

    // --- 6. Custom Reservation Handling ---
    const reserveForm = document.getElementById('reservation-form');
    const successOverlay = document.getElementById('reservation-success-overlay');
    const successDetails = document.getElementById('success-details');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reserve_name').value;
            const email = document.getElementById('reserve_email').value;
            const date = document.getElementById('reserve_date').value;
            const time = document.getElementById('reserve_time').value;
            const guests = document.getElementById('reserve_guests').value;

            // Show Overlay & Spinner
            successOverlay.classList.remove('hidden');
            successOverlay.classList.add('flex');
            
            const spinner = successOverlay.querySelector('.spinner-container');
            const content = successOverlay.querySelector('.success-content');
            
            spinner.classList.remove('hidden');
            content.classList.add('hidden');

            // Simulate server roundtrip
            setTimeout(() => {
                spinner.classList.add('hidden');
                content.classList.remove('hidden');
                
                if (successDetails) {
                    successDetails.innerHTML = `Thank you, <strong>${name}</strong>. We have received your request for <strong>${guests}</strong> guests on <strong>${date}</strong> at <strong>${time}</strong>. A confirmation has been sent to <strong>${email}</strong>.`;
                }
            }, 1800);
        });
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successOverlay.classList.add('hidden');
            successOverlay.classList.remove('flex');
            reserveForm.reset();
            
            // Dispatch input event to clear labels styling
            document.querySelectorAll('#reservation-form input, #reservation-form textarea').forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
    }
});
