clear

% Set the time step
h = 0.01;

% Set the final time
tf = 10;

% Set the initial time
t = 0;

% Set the mass, spring constant, and damping constant
m = 1;
k = 10;
c = 2;

% Set the length of the spring at rest
L = 0.5;

% Set the initial conditions
x0 = [1+L, 2+L, 3+L, 4+L, 0, 0, 0, 0];

% Preallocate the solution arrays
x = zeros(8, (tf/h) + 1);
x(:,1) = x0;

% Solve the ODE using the RK4 method
i = 1;
while t <= tf
    k1 = h*square_spring_damper(t, x(:,i), m, k, c, L);
    k2 = h*square_spring_damper(t + h/2, x(:,i) + k1/2, m, k, c, L);
    k3 = h*square_spring_damper(t + h, x(:,i) + k2/2, m, k, c, L);
    k4 = h*square_spring_damper(t + h, x(:,i) + k3, m, k, c, L);
    x(:,i+1) = x(:,i) + (k1 + 2*k2 + 2*k3 + k4)/6;
    t = t + h;
    i = i + 1;
end

% Plot the solution
time = 0:h:tf + 0.01;

plot(time, x(1,:))
hold on
plot(time, x(2,:))
hold on
plot(time, x(3,:))
hold on
plot(time, x(4,:))

xlabel('Time')
ylabel('Position')
legend('Mass 1', 'Mass 2', 'Mass 3', 'Mass 4')


% 
% figure;
% subplot(2,2,1);
% plot(time, x(1,:));
% title('Position of Mass 1');
% xlabel('Time (s)');
% ylabel('Position (m)');
% subplot(2,2,2);
% plot(time, x(2,:));
% title('Position of Mass 2');
% xlabel('Time (s)');
% ylabel('Position (m)');
% subplot(2,2,3);
% plot(time, x(3,:));
% title('Position of Mass 3');
% xlabel('Time (s)');
% ylabel('Position (m)');
% subplot(2,2,4);
% plot(time, x(4,:));
% title('Position of Mass 4');
% xlabel('Time (s)');
% ylabel('Position (m)');
% 
